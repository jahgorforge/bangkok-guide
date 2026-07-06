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

    // Determine prefix: from /pages/ subdirectory need ../ to go up one level
    const isInPages = window.location.pathname.includes('/pages/');
    const prefix = isInPages ? '../' : '';

    nav.innerHTML = '';

    categories.forEach(cat => {
      const li = document.createElement('li');
      li.className = 'sidebar-nav__item';

      const a = document.createElement('a');
      a.className = 'sidebar-nav__link';
      if (cat.id === activeCat) {
        a.classList.add('sidebar-nav__link--active');
      }
      a.href = `${prefix}pages/${cat.id}.html`;

      const icon = document.createElement('span');
      icon.className = 'sidebar-nav__icon';
      icon.textContent = cat.icon || '•';

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
  }
};
