/*
 * home.js — Render home page bento knowledge sections
 *
 * Loads sections.json and renders the expandable "bento" card layout.
 */

const Home = (() => {

  /**
   * Initialize the home page.
   * Loads section data and renders cards into the container.
   */
  async function init() {
    const container = document.getElementById('home-sections');
    if (!container) return;

    const sections = await Loader.fetchJSON('data/sections.json');
    if (!sections) return;

    container.innerHTML = '';
    sections.forEach(section => {
      container.appendChild(createCard(section));
    });

    initExpand();
  }

  /**
   * Create a single knowledge section card.
   */
  function createCard(section) {
    const card = document.createElement('div');
    card.className = 'home-card';
    card.dataset.sectionId = section.id;

    // --- Header ---
    const header = document.createElement('div');
    header.className = 'home-card__header';

    const left = document.createElement('div');
    left.className = 'home-card__header-left';

    // Icon
    const iconWrap = document.createElement('div');
    iconWrap.className = 'home-card__icon';
    if (section.id === 'emergency') {
      iconWrap.classList.add('home-card__icon--emergency');
    }
    const iconEl = Icons.create(section.icon);
    if (iconEl) iconWrap.appendChild(iconEl);
    left.appendChild(iconWrap);

    // Title + subtitle
    const info = document.createElement('div');
    info.className = 'home-card__info';

    const title = document.createElement('div');
    title.className = 'home-card__title';
    title.textContent = section.title;
    info.appendChild(title);

    const subtitle = document.createElement('div');
    subtitle.className = 'home-card__subtitle';
    subtitle.textContent = section.subtitle;
    info.appendChild(subtitle);

    left.appendChild(info);
    header.appendChild(left);

    // Arrow (down when collapsed, up when expanded)
    const arrow = document.createElement('div');
    arrow.className = 'home-card__arrow';
    arrow.innerHTML = `<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4.5 6 8 9.5 4.5"/></svg>`;
    header.appendChild(arrow);

    card.appendChild(header);

    // --- Body (expandable) ---
    const body = document.createElement('div');
    body.className = 'home-card__body';

    const inner = document.createElement('div');
    inner.className = 'home-card__body-inner';

    if (section.type === 'contact') {
      // Emergency-style: name + phone rows
      section.items.forEach(item => {
        inner.appendChild(createContactItem(item));
      });
    } else if (section.type === 'labeled') {
      // Labeled items with uppercase labels
      section.items.forEach(item => {
        inner.appendChild(createLabeledItem(item));
      });
    } else {
      // Text-only items
      section.items.forEach(item => {
        inner.appendChild(createTextItem(item));
      });
    }

    body.appendChild(inner);
    card.appendChild(body);

    return card;
  }

  function createContactItem(item) {
    const div = document.createElement('div');
    div.className = 'home-card__contact';
    div.innerHTML = `
      <span class="home-card__contact-name">${item.name}</span>
      <span class="home-card__contact-phone">${item.phone}</span>
    `;
    return div;
  }

  function createLabeledItem(item) {
    const div = document.createElement('div');
    div.className = 'home-card__item';
    div.innerHTML = `
      <div class="home-card__item-label">${item.label}</div>
      <div class="home-card__item-text">${item.text}</div>
    `;
    return div;
  }

  function createTextItem(item) {
    const div = document.createElement('div');
    div.className = 'home-card__item home-card__item--text-only';
    div.innerHTML = `<div class="home-card__item-text">${item.text}</div>`;
    return div;
  }

  /**
   * Initialize expand/collapse behavior.
   * All cards start collapsed. Tap/click toggles expand/collapse.
   */
  function initExpand() {
    const cards = document.querySelectorAll('.home-card');

    cards.forEach(card => {
      const body = card.querySelector('.home-card__body');
      if (!body) return;

      // All cards start collapsed
      body.style.maxHeight = '0';

      card.addEventListener('click', () => {
        const isExpanded = card.classList.contains('home-card--expanded');
        if (isExpanded) {
          body.style.maxHeight = '0';
          card.classList.remove('home-card--expanded');
        } else {
          body.style.maxHeight = body.scrollHeight + 'px';
          card.classList.add('home-card--expanded');
        }
      });
    });
  }

  return { init };
})();
