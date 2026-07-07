/*
 * filter.js — Client-side search and tag filtering.
 */

const Filter = {
  activeTags: new Set(),
  searchText: '',

  /**
   * Initialize filter controls for a category page.
   * @param {Array} items - The full items array (to extract tags).
   */
  init(items) {
    this.activeTags = new Set();
    this.searchText = '';

    const searchInput = document.getElementById('search-input');
    const tagContainer = document.getElementById('tag-filters');

    if (!searchInput && !tagContainer) return;

    // Build tag chips from the union of all tags in the data
    if (tagContainer) {
      this.buildTagFilters(items, tagContainer);
    }

    // Search input handler
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchText = e.target.value.toLowerCase().trim();
        this.apply();
      });
    }
  },

  /**
   * Build tag filter chips.
   */
  buildTagFilters(items, container) {
    const tagSet = new Set();
    items.forEach(item => {
      (item.tags || []).forEach(t => tagSet.add(t));
    });

    if (tagSet.size === 0) return;

    container.innerHTML = '';
    tagSet.forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'filter-bar__tag';
      chip.textContent = tag;
      chip.dataset.tag = tag;

      chip.addEventListener('click', () => {
        if (this.activeTags.has(tag)) {
          this.activeTags.delete(tag);
          chip.classList.remove('filter-bar__tag--active');
        } else {
          this.activeTags.add(tag);
          chip.classList.add('filter-bar__tag--active');
        }
        this.apply();
      });

      container.appendChild(chip);
    });
  },

  /**
   * Apply active filters to the card grid.
   * Cards that don't match get .card--hidden.
   */
  apply() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const name = (card.dataset.name || '');
      const tags = (card.dataset.tags || '').split('|');

      // Text search: match against name
      const matchesSearch = !this.searchText || name.includes(this.searchText);

      // Tag filter: card must have ALL active tags
      const matchesTags = this.activeTags.size === 0 ||
        [...this.activeTags].every(t => tags.includes(t));

      card.classList.toggle('card--hidden', !(matchesSearch && matchesTags));
    });
  }
};
