/*
 * icons.js — SVG icon system
 *
 * All icons are 24x24 viewBox, monochrome line-style.
 * Color is controlled via CSS (default #555555, accent #C5A35A).
 *
 * Usage:
 *   Icons.get('food')        → SVG string
 *   Icons.create('food')     → DOM element
 *   Icons.create('food', 'icon--accent') → DOM element with class
 */

const Icons = (() => {
  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Inline SVG strings — identical to files in /assets/icons/
  const definitions = {
    food:
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="6" y1="3" x2="6" y2="10"/>
        <line x1="9" y1="2" x2="9" y2="10"/>
        <line x1="12" y1="3" x2="12" y2="10"/>
        <path d="M6 10 9 10 12 10"/>
        <line x1="9" y1="10" x2="9" y2="21"/>
        <ellipse cx="18" cy="6" rx="2.5" ry="3.5"/>
        <line x1="18" y1="9.5" x2="18" y2="21"/>
      </svg>`,

    shopping:
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 7 8 3h8l2 4"/>
        <rect x="4" y="7" width="16" height="13" rx="2"/>
        <path d="M16 11a4 4 0 0 1-8 0"/>
      </svg>`,

    hotel:
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 21V7l9-5 9 5v14"/>
        <path d="M9 21V13h6v8"/>
      </svg>`,

    transport:
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="3" width="16" height="14" rx="2"/>
        <circle cx="8" cy="19" r="2"/>
        <circle cx="16" cy="19" r="2"/>
        <line x1="4" y1="9" x2="20" y2="9"/>
      </svg>`,

    attraction:
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="2" x2="12" y2="5"/>
        <path d="M12 5 16 11v7H8v-7l4-6z"/>
        <rect x="6" y="18" width="12" height="3" rx="1"/>
      </svg>`,

    cafe:
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9h12l-1 10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9z"/>
        <path d="M18 9h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
      </svg>`,

    wellness:
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3s-4 4.5-4 9c0 3 2.5 6 4 9c1.5-3 4-6 4-9s-4-9-4-9z"/>
        <path d="M8 12s-5 1-5 5c0 2 2.5 4 5 4"/>
        <path d="M16 12s5 1 5 5c0 2-2.5 4-5 4"/>
      </svg>`,

    'map-pin':
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2C8 2 5 5 5 9c0 6 7 13 7 13s7-7 7-13c0-4-3-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>`,

    note:
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="13" y2="17"/>
      </svg>`
  };

  /**
   * Get an SVG string by icon name.
   * @param {string} name - Icon name (food, shopping, etc.)
   * @returns {string}
   */
  function get(name) {
    return definitions[name] || '';
  }

  /**
   * Create an SVG DOM element.
   * @param {string} name - Icon name
   * @param {string} className - Optional CSS class
   * @returns {SVGElement|null}
   */
  function create(name, className) {
    const svgString = definitions[name];
    if (!svgString) return null;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = svgString.trim();
    const svg = wrapper.firstElementChild;
    if (className) svg.classList.add(className);
    return svg;
  }

  /**
   * Check if an icon name exists.
   * @param {string} name
   * @returns {boolean}
   */
  function has(name) {
    return !!definitions[name];
  }

  return { get, create, has };
})();
