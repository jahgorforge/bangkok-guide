/*
 * filter.js — Simple category filtering for City Guide Cards.
 *
 * Filter dimensions: type + budget + text search.
 * Displays Chinese labels using taxonomy/tags.json.
 * Internal filtering still uses English values.
 */

const Filter = {
  activeFilters: { type: null, budget: null },
  searchText: '',
  _tagDict: null,

  /**
   * Load tag dictionary for Chinese display names.
   */
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

  /**
   * Look up Chinese display name for a tag/type value.
   */
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
      const typeRow = document.createElement('div');
      typeRow.className = 'filter-row';

      const allBtn = this._createChip('All', 'type', null, true);
      typeRow.appendChild(allBtn);

      types.forEach(t => {
        const label = this._displayName(t);
        const btn = this._createChip(label, 'type', t, false);
        typeRow.appendChild(btn);
      });

      container.appendChild(typeRow);
    }

    if (budgets.size > 0) {
      const budgetRow = document.createElement('div');
      budgetRow.className = 'filter-row';

      const allBtn = this._createChip('All', 'budget', null, true);
      budgetRow.appendChild(allBtn);

      budgets.forEach(b => {
        const btn = this._createChip(b, 'budget', b, false);
        budgetRow.appendChild(btn);
      });

      container.appendChild(budgetRow);
    }
  },

  _createChip(label, dim, value, isActive) {
    const chip = document.createElement('span');
    chip.className = 'filter-bar__tag';
    if (isActive) chip.classList.add('filter-bar__tag--active');
    chip.textContent = label;
    chip.dataset.dim = dim;
    chip.dataset.value = value || '';

    chip.addEventListener('click', () => {
      const siblingChips = chip.parentElement.querySelectorAll('.filter-bar__tag');
      siblingChips.forEach(c => c.classList.remove('filter-bar__tag--active'));
      chip.classList.add('filter-bar__tag--active');

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
