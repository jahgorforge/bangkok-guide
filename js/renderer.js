/*
 * renderer.js — City Guide Card v1.0
 *
 * Card = quick discovery. Shows only essential info.
 * Supports both v0 (flat) and v1 (structured) schemas.
 */

const Renderer = {
  // Tag dictionary cache
  _tagDict: null,

  /**
   * Load the tag dictionary from taxonomy/tags.json.
   * Returns a Promise that resolves when loaded.
   */
  async loadTagDict() {
    if (this._tagDict) return this._tagDict;
    try {
      // Dynamic path: works from root (/), /pages/, and GH Pages subdirectory
      const isInPages = window.location.pathname.includes('/pages/');
      const prefix = isInPages ? '../' : '';
      const resp = await fetch(prefix + 'taxonomy/tags.json');
      if (resp.ok) this._tagDict = await resp.json();
    } catch (e) {
      this._tagDict = {};
    }
    return this._tagDict;
  },

  /**
   * Translate a tag to Chinese using the dictionary.
   * Falls back to the original tag if not found.
   */
  _translateTag(tag) {
    if (this._tagDict && this._tagDict[tag]) {
      return this._tagDict[tag].zh || tag;
    }
    // Fallback: replace hyphens with spaces
    return tag.replace(/-/g, ' ');
  },

  async renderCards(items, container) {
    // Ensure tag dictionary is loaded
    await this.loadTagDict();

    container.innerHTML = '';
    if (!items || items.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      const emptyIcon = document.createElement('div');
      emptyIcon.className = 'empty-state__icon';
      const noteSvg = Icons.create('note');
      if (noteSvg) emptyIcon.appendChild(noteSvg);
      emptyState.appendChild(emptyIcon);
      const emptyText = document.createElement('p');
      emptyText.className = 'empty-state__text';
      emptyText.textContent = 'No entries yet.';
      emptyState.appendChild(emptyText);
      container.appendChild(emptyState);
      return;
    }
    items.forEach(item => {
      container.appendChild(this.buildCard(item));
    });
  },

  // ——— Schema helpers (v0 + v1) ———

  _getName(item) {
    if (typeof item.name === 'string') return { en: item.name, local: '' };
    if (item.name && typeof item.name === 'object') {
      return {
        en: item.name.en || item.name.zh || '',
        local: item.name.local || ''
      };
    }
    return { en: 'Untitled', local: '' };
  },

  _getType(item) {
    if (item.type) return item.type.replace(/-/g, ' ');
    return '';
  },

  _getLocation(item) {
    if (typeof item.location === 'string') return item.location;
    if (item.location && typeof item.location === 'object') {
      return item.location.district || item.area || '';
    }
    return item.area || '';
  },

  _getTags(item) {
    if (Array.isArray(item.tags)) return item.tags;
    if (item.tags && typeof item.tags === 'object') {
      // Flatten all dimensions into one array
      const all = [];
      Object.values(item.tags).forEach(arr => {
        if (Array.isArray(arr)) arr.forEach(t => { if (t) all.push(t); });
      });
      return all;
    }
    return [];
  },

  _getPickTags(item) {
    // Pick max 3 tags: type + experience highlight + food
    if (Array.isArray(item.tags)) return item.tags.slice(0, 3);
    if (item.tags && typeof item.tags === 'object') {
      const picks = [];
      // 1. type/style first
      if (item.tags.style && item.tags.style.length) picks.push(item.tags.style[0]);
      // 2. experience
      if (item.tags.experience && item.tags.experience.length && picks.length < 3) picks.push(item.tags.experience[0]);
      // 3. food
      if (item.tags.food && item.tags.food.length && picks.length < 3) picks.push(item.tags.food[0]);
      // Fill remaining if needed
      if (picks.length < 3 && item.tags.style && item.tags.style.length > 1) picks.push(item.tags.style[1]);
      if (picks.length < 3 && item.tags.food && item.tags.food.length > 1) picks.push(item.tags.food[1]);
      return picks.slice(0, 3);
    }
    return [];
  },

  _getPrice(item) {
    if (item.priceRange) return item.priceRange;
    if (item.practical && item.practical.priceRange) return item.practical.priceRange;
    return '';
  },

  _getSummary(item) {
    if (item.experience && item.experience.summary) return item.experience.summary;
    if (item.notes) return item.notes;
    return '';
  },

  _getMapsLink(item) {
    if (!item.links) return '';
    if (typeof item.links === 'string') return item.links;
    return item.links.googleMaps || item.links.website || '';
  },

  _getPhone(item) {
    if (item.links && item.links.phone) return item.links.phone;
    if (item.contact && item.contact.phone) return item.contact.phone;
    return '';
  },

  // ——— Card Builder ———

  buildCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = item.id || '';

    const tags = this._getTags(item);
    // Include type and budget in dataset for filtering
    const typeStr = this._getType(item);
    const priceStr = this._getPrice(item);
    const searchTags = [...tags];
    if (typeStr) searchTags.push(typeStr);
    if (priceStr) searchTags.push(priceStr);
    card.dataset.tags = searchTags.join('|');
    const name = this._getName(item);
    card.dataset.name = (name.en || name.local).toLowerCase();

    // ===== NAME ROW =====
    // English name (primary) + Thai name (secondary)
    const nameRow = document.createElement('div');
    nameRow.className = 'card__name-row';

    const enEl = document.createElement('span');
    enEl.className = 'card__name';
    enEl.textContent = name.en || name.local;
    nameRow.appendChild(enEl);

    if (name.local && name.en) {
      const localEl = document.createElement('span');
      localEl.className = 'card__name-local';
      localEl.textContent = name.local;
      nameRow.appendChild(localEl);
    }

    card.appendChild(nameRow);

    // ===== TAGS ROW (max 3) =====
    const pickTags = this._getPickTags(item);
    if (pickTags.length > 0) {
      const tagRow = document.createElement('div');
      tagRow.className = 'card__tag-row';
      pickTags.forEach(t => {
        const badge = document.createElement('span');
        badge.className = 'card__badge';
        badge.textContent = this._translateTag(t);
        tagRow.appendChild(badge);
      });
      card.appendChild(tagRow);
    }

    // ===== LOCATION =====
    const locText = this._getLocation(item);
    if (locText) {
      const locEl = document.createElement('div');
      locEl.className = 'card__location';
      const icon = Icons.create('map-pin');
      icon.classList.add('card__location-icon');
      locEl.appendChild(icon);
      locEl.appendChild(document.createTextNode(locText));
      card.appendChild(locEl);
    }

    // ===== SUMMARY (max 2 lines) =====
    const summary = this._getSummary(item);
    if (summary) {
      const summaryEl = document.createElement('div');
      summaryEl.className = 'card__summary';
      summaryEl.textContent = summary;
      card.appendChild(summaryEl);
    }

    // ===== BOTTOM ROW: Price + Actions =====
    const price = this._getPrice(item);
    const mapsLink = this._getMapsLink(item);
    const phone = this._getPhone(item);

    if (price || mapsLink || phone) {
      const bottomRow = document.createElement('div');
      bottomRow.className = 'card__bottom';

      if (price) {
        const priceEl = document.createElement('span');
        priceEl.className = 'card__price';
        priceEl.textContent = price;
        bottomRow.appendChild(priceEl);
      }

      if (mapsLink || phone) {
        const actions = document.createElement('div');
        actions.className = 'card__actions';

        if (mapsLink) {
          const btn = document.createElement('a');
          btn.className = 'card__action-btn';
          btn.href = mapsLink;
          btn.target = '_blank';
          btn.rel = 'noopener';
          btn.textContent = '🗺 Maps';
          actions.appendChild(btn);
        }

        if (phone) {
          const btn = document.createElement('a');
          btn.className = 'card__action-btn';
          btn.href = 'tel:' + phone;
          btn.textContent = '☎ Phone';
          actions.appendChild(btn);
        }

        bottomRow.appendChild(actions);
      }

      card.appendChild(bottomRow);
    }

    return card;
  }
};
