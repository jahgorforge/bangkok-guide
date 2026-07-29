/*
 * app.js — Main application entry point.
 *
 * Flow:
 *   index.html (root)      → Load categories.json → Render bento home + sidebar + mobile nav
 *   pages/{cat}.html       → Extract cat from filename → Load category + data → Render cards + chips + back-to-top
 */

(async function main() {
  // Determine data path prefix based on page location
  const isCategoryPage = window.location.pathname.includes('/pages/');
  const dataBase = isCategoryPage ? '../data/' : 'data/';

  const categories = await Loader.fetchJSON(dataBase + 'categories.json');
  if (!categories) {
    console.error('Failed to load categories.json');
    return;
  }

  if (isCategoryPage) {
    await initCategoryPage(categories, dataBase);
  } else {
    await initHomePage(categories);
  }
})();

/**
 * Initialize the home page — render bento knowledge sections.
 */
async function initHomePage(categories) {
  // Render sidebar navigation (desktop)
  Sidebar.renderNav(categories, null);

  // Render mobile navigation
  Sidebar.renderMobileNav(categories, null);

  // Render bento knowledge sections
  await Home.init();

  // Sync fixed-header height
  syncFixedHeaderHeight();
}

/**
 * Initialize a category page — detect category from filename, load data, render cards.
 */
async function initCategoryPage(categories, dataBase) {
  // Extract category ID from the page filename (e.g. "/pages/food.html" → "food")
  const pathParts = window.location.pathname.split('/');
  const filename = pathParts[pathParts.length - 1];    // "food.html"
  const catId = filename.replace('.html', '');          // "food"

  // Find category metadata
  const catMeta = categories.find(c => c.id === catId);

  if (!catMeta) {
    document.getElementById('page-title').textContent = 'Category not found';
    document.getElementById('page-desc').textContent =
      `No category matches "${catId}".`;
    Sidebar.renderNav(categories, null);
    Sidebar.renderMobileNav(categories, null);
    return;
  }

  // Update page UI
  document.title = `Bangkok Guide — ${catMeta.label}`;
  document.getElementById('page-title').textContent = catMeta.label;
  document.getElementById('page-desc').textContent = catMeta.description || '';
  document.getElementById('topbar-title').textContent = catMeta.label;

  // Render sidebar (desktop) with active category
  Sidebar.renderNav(categories, catId);

  // Render mobile navigation
  Sidebar.renderMobileNav(categories, catId);

  // Update sidebar header to show ← Category (wayfinding)
  const headerLink = document.querySelector('.sidebar__header-link');
  if (headerLink) {
    headerLink.innerHTML = `<span class="sidebar__title--zh">〈 ${catMeta.label}</span>`;
  }

  // Fetch and render data
  let items = null;
  try {
    items = await Loader.fetchJSON(dataBase + catId + '.json');
    const grid = document.getElementById('card-grid');
    await Renderer.renderCards(items, grid);

    // Update entry count
    const count = items ? items.length : 0;
    document.getElementById('page-count').textContent = `共 ${count} 条记录`;
    const searchCount = document.getElementById('top-app-bar-search-count');
    if (searchCount) searchCount.textContent = `共${count}条记录`;

    // Initialize search and tag filters
    if (items && items.length > 0) {
      await Filter.init(items);
    }

    // Wire TopAppBar search to filter
    const topSearch = document.getElementById('top-app-bar-search');
    const inlineSearch = document.getElementById('search-input');
    if (topSearch && inlineSearch) {
      topSearch.addEventListener('input', (e) => {
        inlineSearch.value = e.target.value;
        inlineSearch.dispatchEvent(new Event('input'));
      });
    }
  } catch (e) {
    console.error('Category page init error:', e);
  }

  // Initialize interactive map (mobile only, skip transport page)
  if (typeof MapModule !== 'undefined' && items && catId !== 'transport') {
    MapModule.init(items);
  }

  // Back-to-top button — always initialize, even if data loading fails
  initBackToTop();

  // Sync fixed-header height to CSS custom property
  syncFixedHeaderHeight();
}

/**
 * Measure the fixed-header's actual rendered height and set it as
 * --fixed-header-height on :root so .main-content's padding-top stays
 * in sync regardless of chip count or font size.
 * Uses ResizeObserver for automatic recalculation when content changes.
 */
function syncFixedHeaderHeight() {
  const header = document.getElementById('fixed-header');
  if (!header) return;

  const update = () => {
    const h = header.getBoundingClientRect().height;
    console.log('syncFixedHeaderHeight update fired', h, Date.now());
    document.documentElement.style.setProperty('--fixed-header-height', h + 'px');
  };

  // Measure initially
  update();

  // Only re-measure on width change (ignore address-bar show/hide on mobile)
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth !== lastWidth) {
      lastWidth = window.innerWidth;
      update();
    }
  });

  // Watch for dynamic content changes (chip rows, etc.)
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(update);
    ro.observe(header);
  }
}

/**
 * Back-to-top button — shows on scroll, scrolls to top on click.
 */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const handleScroll = () => {
    const show = window.scrollY > 50;
    btn.classList.toggle('back-to-top--visible', show);
  };
  // Check on load and on every scroll
  handleScroll();

  window.addEventListener('scroll', handleScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
