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
    wrapMarkdownSections(container);
    initAccordion();
  }
}

/**
 * Wrap each h2 section in the rendered markdown into a white card.
 * Content before the first h2 stays outside cards as intro.
 */
function wrapMarkdownSections(container) {
  const children = Array.from(container.children);
  container.innerHTML = '';

  const firstH2Index = children.findIndex(el => el.tagName === 'H2');
  if (firstH2Index === -1) {
    // No sections — restore content as-is
    children.forEach(el => container.appendChild(el));
    return;
  }

  // Render intro content (h1, intro p, hr) outside cards
  if (firstH2Index > 0) {
    const intro = document.createElement('div');
    intro.className = 'markdown-intro';
    children.slice(0, firstH2Index).forEach(el => intro.appendChild(el));
    container.appendChild(intro);
  }

  // Wrap each h2-and-following section in a card
  let buffer = [];
  for (let i = firstH2Index; i < children.length; i++) {
    const el = children[i];
    if (el.tagName === 'H2') {
      if (buffer.length > 0) container.appendChild(buildCard(buffer));
      buffer = [el];
    } else {
      buffer.push(el);
    }
  }
  if (buffer.length > 0) container.appendChild(buildCard(buffer));
}

/**
 * Build a single section card DOM element.
 */
function buildCard(elements) {
  const card = document.createElement('div');
  card.className = 'markdown-card';

  const h2 = elements[0];
  const rest = elements.slice(1);

  // Header with title + toggle arrow
  const header = document.createElement('div');
  header.className = 'markdown-card__header';
  header.appendChild(h2);

  const toggle = document.createElement('span');
  toggle.className = 'markdown-card__toggle';
  toggle.textContent = '▼';
  header.appendChild(toggle);

  card.appendChild(header);

  // Body with remaining content
  if (rest.length > 0) {
    const body = document.createElement('div');
    body.className = 'markdown-card__body';
    rest.forEach(el => body.appendChild(el));
    card.appendChild(body);
  }

  return card;
}

/**
 * Initialize mobile accordion behavior on section cards.
 *
 * On mobile only (<768px), cards are collapsible by tapping the header.
 * First section (交通) is expanded by default, all others collapsed.
 * Desktop remains fully expanded via CSS.
 */
function initAccordion() {
  const cards = document.querySelectorAll('.markdown-card');
  if (!cards.length) return;

  cards.forEach((card, index) => {
    const body = card.querySelector('.markdown-card__body');
    const header = card.querySelector('.markdown-card__header');
    if (!body || !header) return;

    // First section expanded by default on mobile
    if (index === 0) {
      card.classList.add('markdown-card--expanded');
      body.style.maxHeight = body.scrollHeight + 'px';
    } else {
      body.style.maxHeight = '0';
    }

    header.addEventListener('click', () => {
      if (window.innerWidth >= 768) return;

      if (card.classList.contains('markdown-card--expanded')) {
        body.style.maxHeight = '0';
        card.classList.remove('markdown-card--expanded');
      } else {
        body.style.maxHeight = body.scrollHeight + 'px';
        card.classList.add('markdown-card--expanded');
      }
    });
  });
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
