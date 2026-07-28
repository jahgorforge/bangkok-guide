/*
 * sidebar.js — Navigation rendering and mobile menu behavior.
 */

const Sidebar = {
  /**
   * Render sidebar navigation from categories data.
   * @param {Array} categories - Array of category objects from categories.json.
   * @param {string} activeCat - ID of the currently active category (or null).
   */
  renderNav(categories, activeCat) {
    const nav = document.getElementById('sidebar-nav');
    if (!nav) return;

    // All category pages are in the same /pages/ directory.
    // From root:          use pages/food.html
    // From within /pages/: use food.html directly
    const isInPages = window.location.pathname.includes('/pages/');
    const prefix = isInPages ? '' : 'pages/';

    nav.innerHTML = '';

    // Home entry
    const homeLi = document.createElement('li');
    homeLi.className = 'sidebar-nav__item';

    const homeA = document.createElement('a');
    homeA.className = 'sidebar-nav__link';
    if (activeCat === null) {
      homeA.classList.add('sidebar-nav__link--active');
    }
    homeA.href = isInPages ? '../index.html' : 'index.html';

    const homeIcon = Icons.create('home') || document.createTextNode('•');
    homeIcon.classList.add('sidebar-nav__icon');

    homeA.appendChild(homeIcon);
    homeA.appendChild(document.createTextNode('首页'));
    homeLi.appendChild(homeA);
    nav.appendChild(homeLi);

    categories.forEach(cat => {
      const li = document.createElement('li');
      li.className = 'sidebar-nav__item';

      const a = document.createElement('a');
      a.className = 'sidebar-nav__link';
      if (cat.id === activeCat) {
        a.classList.add('sidebar-nav__link--active');
      }
      a.href = `${prefix}${cat.id}.html`;

      const icon = Icons.create(cat.icon) || document.createTextNode('•');
      icon.classList.add('sidebar-nav__icon');

      a.appendChild(icon);
      a.appendChild(document.createTextNode(cat.label || cat.id));

      li.appendChild(a);
      nav.appendChild(li);
    });
  },

  /**
   * Initialize mobile hamburger menu behavior.
   */
  initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (!hamburger || !sidebar || !overlay) return;

    const open = () => {
      sidebar.classList.add('sidebar--open');
      overlay.classList.add('sidebar-overlay--visible');
    };

    const close = () => {
      sidebar.classList.remove('sidebar--open');
      overlay.classList.remove('sidebar-overlay--visible');
    };

    hamburger.addEventListener('click', open);
    overlay.addEventListener('click', close);

    // Sidebar header home link closes the sidebar on mobile
    const headerLink = document.querySelector('.sidebar__header-link');
    if (headerLink) {
      headerLink.addEventListener('click', close);
    }
  },

  /**
   * Render the mobile top navigation bar.
   *
   * Creates a fixed horizontal scrollable nav from categories.
   * The nav container (#top-nav) is created dynamically if it
   * doesn't exist in the HTML.
   *
   * @param {Array} categories - Array of category objects from categories.json.
   * @param {string|null} activeCat - ID of the currently active category (or null for home).
   */
  renderMobileNav(categories, activeCat) {
    // Create TopAppBar (mobile only — shows "曼谷指南")
    let appBar = document.getElementById('top-app-bar');
    if (!appBar) {
      appBar = document.createElement('header');
      appBar.className = 'top-app-bar';
      appBar.id = 'top-app-bar';
      document.body.prepend(appBar);
    }
    // Build TopAppBar content
    const isCategoryPage = activeCat !== null;
    appBar.innerHTML = '';

    // Title
    const titleSpan = document.createElement('span');
    titleSpan.className = 'top-app-bar__title';
    titleSpan.textContent = '曼谷指南';
    appBar.appendChild(titleSpan);

    // Search bar (only on category pages)
    if (isCategoryPage) {
      const searchWrap = document.createElement('div');
      searchWrap.className = 'top-app-bar__search';

      const searchIcon = document.createElement('span');
      searchIcon.className = 'top-app-bar__search-icon';
      searchIcon.innerHTML = `<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="8" cy="8" r="6"/><path d="m12 12 4 4"/>
      </svg>`;
      searchWrap.appendChild(searchIcon);

      const searchInput = document.createElement('input');
      searchInput.className = 'top-app-bar__search-input';
      searchInput.type = 'text';
      searchInput.placeholder = '搜索我的收藏...';
      searchInput.autocomplete = 'off';
      searchInput.id = 'top-app-bar-search';
      searchWrap.appendChild(searchInput);

      const searchCount = document.createElement('span');
      searchCount.className = 'top-app-bar__search-count';
      searchCount.id = 'top-app-bar-search-count';
      searchWrap.appendChild(searchCount);

      appBar.appendChild(searchWrap);
    }

    // Create / update horizontal tab nav
    let nav = document.getElementById('top-nav');
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'top-nav';
      nav.id = 'top-nav';
      // Insert after TopAppBar (appBar is already first child of body)
      appBar.after(nav);
    }

    nav.innerHTML = '';

    // Determine path prefix based on page location
    const isInPages = window.location.pathname.includes('/pages/');
    const prefix = isInPages ? '' : 'pages/';

    // Home link
    const homeLink = document.createElement('a');
    homeLink.className = 'top-nav__link';
    if (activeCat === null) {
      homeLink.classList.add('top-nav__link--active');
    }
    homeLink.href = isInPages ? '../index.html' : 'index.html';
    homeLink.textContent = '首页';
    nav.appendChild(homeLink);

    // Category links
    categories.forEach(cat => {
      const link = document.createElement('a');
      link.className = 'top-nav__link';
      if (cat.id === activeCat) {
        link.classList.add('top-nav__link--active');
      }
      link.href = `${prefix}${cat.id}.html`;
      link.textContent = cat.label;
      nav.appendChild(link);
    });
  }
};
