/*
 * filter.js — Category filtering with chip-style UI.
 *
 * Two chip rows: category type + price level.
 * Uses new `chip` / `chip--active` classes from card.css v2.
 */

const Filter = {
  activeFilters: { type: null, budget: null },
  searchText: '',
  _tagDict: null,

  async _loadTagDict() {
    if (this._tagDict) return;
    try {
      const isInPages = window.location.pathname.includes('/pages/');
      const prefix = isInPages ? '../' : '';
      const resp = await fetch(prefix + 'taxonomy/tags.json');
      if (resp.ok) this._tagDict = await resp.json();
    } catch (e) {
      this._tagDict = {};
    }
  },

  _displayName(val) {
    const lower = val.toLowerCase().replace(/ /g, '-');
    if (this._tagDict && this._tagDict[lower]) {
      return this._tagDict[lower].zh || val;
    }
    if (this._tagDict && this._tagDict[val.toLowerCase()]) {
      return this._tagDict[val.toLowerCase()].zh || val;
    }
    return val;
  },

  async init(items) {
    await this._loadTagDict();

    this.activeFilters = { type: null, budget: null };
    this.searchText = '';

    const searchInput = document.getElementById('search-input');
    const tagContainer = document.getElementById('tag-filters');

    if (!searchInput && !tagContainer) return;

    if (tagContainer) {
      this.buildFilters(items, tagContainer);
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchText = e.target.value.toLowerCase().trim();
        this.apply();
      });
    }
  },

  _getType(item) {
    if (item.type) return item.type.replace(/-/g, ' ');
    return '';
  },

  _getBudget(item) {
    if (item.priceRange) return item.priceRange;
    if (item.practical && item.practical.priceRange) return item.practical.priceRange;
    return '';
  },

  _getTags(item) {
    if (Array.isArray(item.tags)) return item.tags;
    if (item.tags && typeof item.tags === 'object') {
      const all = [];
      Object.values(item.tags).forEach(arr => {
        if (Array.isArray(arr)) arr.forEach(t => { if (t) all.push(t); });
      });
      return all;
    }
    return [];
  },

  buildFilters(items, container) {
    const types = new Set();
    const budgets = new Set();
    items.forEach(item => {
      const t = this._getType(item);
      if (t) types.add(t);
      const b = this._getBudget(item);
      if (b) budgets.add(b);
    });

    container.innerHTML = '';

    if (types.size > 0) {
      const row = document.createElement('div');
      row.className = 'chip-row';

      const allChip = this._createChip('全部', 'type', null, true);
      row.appendChild(allChip);

      types.forEach(t => {
        const label = this._displayName(t);
        const chip = this._createChip(label, 'type', t, false);
        row.appendChild(chip);
      });

      container.appendChild(row);
    }

    if (budgets.size > 0) {
      const row = document.createElement('div');
      row.className = 'chip-row';

      const allChip = this._createChip('全部', 'budget', null, true);
      row.appendChild(allChip);

      // Sort budgets by length: $ → $$ → $$$ → $$$$ → $$$$$
      const sorted = Array.from(budgets).sort((a, b) => a.length - b.length);
      sorted.forEach(b => {
        const chip = this._createChip(b, 'budget', b, false);
        chip.classList.add('chip--price');
        row.appendChild(chip);
      });

      container.appendChild(row);
    }
  },

  _createChip(label, dim, value, isActive) {
    const chip = document.createElement('span');
    chip.className = 'chip';
    if (isActive) chip.classList.add('chip--active');
    chip.textContent = label;
    chip.dataset.dim = dim;
    chip.dataset.value = value || '';

    chip.addEventListener('click', () => {
      const siblingChips = chip.parentElement.querySelectorAll('.chip');
      siblingChips.forEach(c => c.classList.remove('chip--active'));
      chip.classList.add('chip--active');

      this.activeFilters[dim] = value;
      this.apply();
    });

    return chip;
  },

  apply() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const name = (card.dataset.name || '').toLowerCase();
      const tags = (card.dataset.tags || '');

      const matchesSearch = !this.searchText || name.includes(this.searchText);

      const typeVal = this.activeFilters.type;
      const matchesType = !typeVal || tags.includes(typeVal.toLowerCase());

      const budgetVal = this.activeFilters.budget;
      const matchesBudget = !budgetVal || tags.includes(budgetVal);

      card.classList.toggle('card--hidden', !(matchesSearch && matchesType && matchesBudget));
    });
  }
};
