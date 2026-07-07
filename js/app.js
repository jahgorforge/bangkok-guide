/*
 * app.js — Main application entry point.
 *
 * Flow:
 *   index.html (root)      → Load categories.json → Render markdown (homepage) + sidebar + mobile nav
 *   pages/{cat}.html       → Extract cat from filename → Load category + data → Render cards + sidebar + mobile nav
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
 * Initialize the home page — render the Essential Guide from Markdown.
 */
async function initHomePage(categories) {
  // Render sidebar navigation (desktop)
  Sidebar.renderNav(categories, null);

  // Render mobile navigation
  Sidebar.renderMobileNav(categories, null);

  // Load and render the Essential Guide markdown
  const mdContent = await Loader.fetchText('content/essential-guide.md');
  const container = document.getElementById('markdown-content');
  if (container) {
    container.innerHTML = Markdown.toHTML(mdContent);
  }
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
  const items = await Loader.fetchJSON(dataBase + catId + '.json');
  const grid = document.getElementById('card-grid');
  await Renderer.renderCards(items, grid);

  // Update entry count
  document.getElementById('page-count').textContent =
    `共 ${items ? items.length : 0} 条记录`;

  // Initialize search and tag filters
  if (items && items.length > 0) {
    await Filter.init(items);
  }
}
