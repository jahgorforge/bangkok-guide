/*
 * renderer.js — City Guide Card v2.0 (Figma Refined)
 *
 * Card structure matching Figma restaurant card design.
 * Supports both v0 (flat) and v1 (structured) schemas.
 */

const Renderer = {
  // Tag dictionary cache
  _tagDict: null,

  /**
   * Load the tag dictionary from taxonomy/tags.json.
   */
  async loadTagDict() {
    if (this._tagDict) return this._tagDict;
    try {
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
   * Translate a tag to Chinese.
   */
  _translateTag(tag) {
    if (this._tagDict && this._tagDict[tag]) {
      return this._tagDict[tag].zh || tag;
    }
    return tag.replace(/-/g, ' ');
  },

  async renderCards(items, container) {
    await this.loadTagDict();

    container.innerHTML = '';
    if (!items || items.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = '<p class="empty-state__text">No entries yet.</p>';
      container.appendChild(emptyState);
      return;
    }
    items.forEach(item => {
      container.appendChild(this.buildCard(item));
    });
  },

  // ——— Schema helpers ———

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
      const all = [];
      Object.values(item.tags).forEach(arr => {
        if (Array.isArray(arr)) arr.forEach(t => { if (t) all.push(t); });
      });
      return all;
    }
    return [];
  },

  _getPickTags(item) {
    if (Array.isArray(item.tags)) return item.tags.slice(0, 3);
    if (item.tags && typeof item.tags === 'object') {
      const picks = [];
      if (item.tags.style && item.tags.style.length) picks.push(item.tags.style[0]);
      if (item.tags.experience && item.tags.experience.length && picks.length < 3) picks.push(item.tags.experience[0]);
      if (item.tags.food && item.tags.food.length && picks.length < 3) picks.push(item.tags.food[0]);
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

  _getRating(item) {
    if (!item.rating) return '';
    // rating can be a number (4.5) or object ({ overall: 4.5 })
    const val = typeof item.rating === 'object' ? item.rating.overall : item.rating;
    if (!val) return '';
    const max = item.ratingMax || 5;
    return `${val} / ${max}`;
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

  // ——— Card Builder (Figma v2) ———

  buildCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = item.id || '';

    // Build tag list for filtering
    const tags = this._getTags(item);
    const priceStr = this._getPrice(item);
    const searchTags = [...tags];
    if (priceStr) searchTags.push(priceStr);
    card.dataset.tags = searchTags.join('|');
    const name = this._getName(item);
    card.dataset.name = (name.en || name.local).toLowerCase();

    // ===== HEADER: Name (left) + Rating/Price (right) =====
    const header = document.createElement('div');
    header.className = 'card__header';

    // Left: Name group
    const nameGroup = document.createElement('div');
    nameGroup.className = 'card__name-group';

    const enEl = document.createElement('div');
    enEl.className = 'card__name';
    enEl.textContent = name.en || name.local;
    nameGroup.appendChild(enEl);

    if (name.local && name.en) {
      const localEl = document.createElement('div');
      localEl.className = 'card__name-local';
      localEl.textContent = name.local;
      nameGroup.appendChild(localEl);
    }

    header.appendChild(nameGroup);

    // Right: Rating + Price + District
    const meta = document.createElement('div');
    meta.className = 'card__meta';

    // Rating row
    const rating = this._getRating(item);
    const price = this._getPrice(item);
    if (rating || price) {
      const ratingRow = document.createElement('div');
      ratingRow.className = 'card__rating-row';
      if (rating) {
        const rEl = document.createElement('span');
        rEl.className = 'card__rating';
        rEl.textContent = rating;
        ratingRow.appendChild(rEl);
      }
      if (price) {
        const pEl = document.createElement('span');
        pEl.className = 'card__price';
        pEl.textContent = price;
        ratingRow.appendChild(pEl);
      }
      meta.appendChild(ratingRow);
    }

    // District
    const locText = this._getLocation(item);
    if (locText) {
      const districtRow = document.createElement('div');
      districtRow.className = 'card__district';
      const icon = Icons.create('map-pin');
      if (icon) {
        icon.classList.add('card__district-icon');
        districtRow.appendChild(icon);
      }
      const dEl = document.createElement('span');
      dEl.className = 'card__district-text';
      dEl.textContent = locText;
      districtRow.appendChild(dEl);
      meta.appendChild(districtRow);
    }

    header.appendChild(meta);
    card.appendChild(header);

    // ===== TAGS ROW =====
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

    // ===== SUMMARY (left accent border) =====
    const summary = this._getSummary(item);
    if (summary) {
      const summaryEl = document.createElement('div');
      summaryEl.className = 'card__summary';
      summaryEl.textContent = summary;
      card.appendChild(summaryEl);
    }

    // ===== ACTION BUTTONS =====
    const mapsLink = this._getMapsLink(item);
    const phone = this._getPhone(item);

    if (mapsLink || phone) {
      const actions = document.createElement('div');
      actions.className = 'card__actions';

      if (phone) {
        const btn = document.createElement('a');
        btn.className = 'card__action-btn';
        btn.href = 'tel:' + phone;
        btn.innerHTML = `
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 11.5v2a1.33 1.33 0 0 1-1.45 1.33 13.2 13.2 0 0 1-5.75-2.04 13 13 0 0 1-4-4A13.2 13.2 0 0 1 1.18 3 1.33 1.33 0 0 1 2.5 1.5h2A1.33 1.33 0 0 1 5.83 2.7 8.6 8.6 0 0 0 6.4 4.8a1.33 1.33 0 0 1-.3 1.4L5.3 7a10.67 10.67 0 0 0 4 4l.8-.8a1.33 1.33 0 0 1 1.4-.3 8.6 8.6 0 0 0 2.1.57 1.33 1.33 0 0 1 1.13 1.36v.67z"/>
          </svg>
          预约订位
        `;
        actions.appendChild(btn);
      }

      if (mapsLink) {
        const btn = document.createElement('a');
        btn.className = 'card__action-btn card__action-btn--map';
        btn.href = mapsLink;
        btn.target = '_blank';
        btn.rel = 'noopener';
        btn.innerHTML = `
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 1C4.67 1 2.75 2.67 2.75 5c0 3.5 4.25 7.58 4.25 7.58s4.25-4.08 4.25-7.58C11.25 2.67 9.33 1 7 1z"/>
            <circle cx="7" cy="5" r="1.5"/>
          </svg>
          地图搜索
        `;
        actions.appendChild(btn);
      }

      card.appendChild(actions);
    }

    return card;
  }
};
