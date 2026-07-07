/*
 * renderer.js — Builds card DOM from data items.
 */

const Renderer = {
  /**
   * Render an array of items as cards into a container.
   * @param {Array} items - Array of item objects.
   * @param {HTMLElement} container - The card grid element.
   */
  renderCards(items, container) {
    container.innerHTML = '';

    if (!items || items.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">📝</div><p class="empty-state__text">No entries yet.</p></div>';
      return;
    }

    items.forEach(item => {
      const card = this.buildCard(item);
      container.appendChild(card);
    });
  },

  /**
   * Build a single card element from one item.
   * @param {Object} item - The data item.
   * @returns {HTMLElement}
   */
  buildCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = item.id || '';
    card.dataset.tags = (item.tags || []).join(' ');
    card.dataset.name = (item.name || '').toLowerCase();

    // Name
    const name = document.createElement('div');
    name.className = 'card__name';
    name.textContent = item.name || 'Untitled';
    card.appendChild(name);

    // Location
    if (item.location) {
      const loc = document.createElement('div');
      loc.className = 'card__location';
      const icon = document.createElement('span');
      icon.className = 'card__location-icon';
      icon.textContent = '📍';
      loc.appendChild(icon);
      loc.appendChild(document.createTextNode(item.location));
      card.appendChild(loc);
    }

    // Rating
    if (item.rating) {
      const rating = document.createElement('div');
      rating.className = 'card__rating';
      const full = Math.round(item.rating);
      const stars = '★'.repeat(full) + '☆'.repeat(5 - full);
      const starSpan = document.createElement('span');
      starSpan.className = 'card__rating-stars';
      starSpan.textContent = stars;
      rating.appendChild(starSpan);
      const numSpan = document.createElement('span');
      numSpan.className = 'card__rating-number';
      numSpan.textContent = item.rating.toFixed(1);
      rating.appendChild(numSpan);
      card.appendChild(rating);
    }

    // Tags
    if (item.tags && item.tags.length > 0) {
      const tags = document.createElement('div');
      tags.className = 'card__tags';
      item.tags.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'card__tag';
        tag.textContent = t;
        tags.appendChild(tag);
      });
      card.appendChild(tags);
    }

    // Notes
    if (item.notes) {
      const notes = document.createElement('div');
      notes.className = 'card__notes';
      notes.textContent = item.notes;
      card.appendChild(notes);
    }

    // Actions (Google Maps & Phone)
    const hasMap = item.links && item.links.googleMaps;
    const hasPhone = item.links && item.links.phone;

    if (hasMap || hasPhone) {
      const actions = document.createElement('div');
      actions.className = 'card__actions';

      if (hasMap) {
        const mapBtn = document.createElement('a');
        mapBtn.className = 'card__btn card__btn--primary';
        mapBtn.href = item.links.googleMaps;
        mapBtn.target = '_blank';
        mapBtn.rel = 'noopener';
        mapBtn.textContent = 'View on Map';
        actions.appendChild(mapBtn);
      }

      if (hasPhone) {
        const callBtn = document.createElement('a');
        callBtn.className = 'card__btn card__btn--secondary';
        callBtn.href = 'tel:' + item.links.phone;
        callBtn.textContent = 'Call';
        actions.appendChild(callBtn);
      }

      card.appendChild(actions);
    }

    return card;
  }
};
