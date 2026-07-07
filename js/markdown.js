/*
 * markdown.js — Lightweight Markdown-to-HTML converter.
 *
 * Supports the subset of Markdown used in essential-guide.md:
 *   - Headers (h1–h6)
 *   - Paragraphs
 *   - Bold / Italic
 *   - Unordered lists
 *   - Tables (with thead + tbody)
 *   - Horizontal rules
 *   - Links
 *   - Images
 *
 * No dependencies, no build step.
 */

const Markdown = {

  /**
   * Convert a Markdown string to HTML.
   * @param {string} md - Raw markdown text.
   * @returns {string} HTML string.
   */
  toHTML(md) {
    if (!md) return '';
    md = md.replace(/\r\n/g, '\n');
    const lines = md.split('\n');

    let html = '';
    let inParagraph = false;
    let inList = false;
    let inTable = false;
    let tableHeaderDone = false;

    const flushParagraph = () => {
      if (inParagraph) { html += '</p>\n'; inParagraph = false; }
    };
    const flushList = () => {
      if (inList) { html += '</ul>\n'; inList = false; }
    };
    const flushTable = () => {
      if (inTable) { html += '</tbody>\n</table>\n'; inTable = false; tableHeaderDone = false; }
    };

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const trimmed = raw.trim();

      // Empty line — flush all open blocks
      if (trimmed === '') {
        flushParagraph(); flushList(); flushTable();
        continue;
      }

      // Horizontal rule (---)
      if (/^-{3,}\s*$/.test(trimmed)) {
        flushParagraph(); flushList(); flushTable();
        html += '<hr>\n';
        continue;
      }

      // Headers (##, ###, etc.)
      const hMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (hMatch) {
        flushParagraph(); flushList(); flushTable();
        const level = hMatch[1].length;
        html += `<h${level}>${this._inline(hMatch[2])}</h${level}>\n`;
        continue;
      }

      // Unordered list
      if (/^[-*+]\s/.test(trimmed)) {
        flushParagraph(); flushTable();
        if (!inList) { html += '<ul>\n'; inList = true; }
        const content = trimmed.replace(/^[-*+]\s+/, '');
        html += `  <li>${this._inline(content)}</li>\n`;
        continue;
      }

      // Table row
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushParagraph(); flushList();

        // Skip separator rows (|---|---| or |---|)
        if (/^\|[-:\s|]+\|$/.test(trimmed)) continue;

        if (!inTable) {
          html += '<table>\n';
          inTable = true;
        }

        const cellTag = tableHeaderDone ? 'td' : 'th';

        // Split by |, remove leading/trailing empty strings
        const parts = trimmed.split('|');
        parts.shift();
        parts.pop();

        if (!tableHeaderDone) {
          html += '  <thead>\n    <tr>\n';
        } else {
          html += '    <tr>\n';
        }

        parts.forEach(c => {
          html += `      <${cellTag}>${this._inline(c.trim())}</${cellTag}>\n`;
        });

        if (!tableHeaderDone) {
          html += '    </tr>\n  </thead>\n  <tbody>\n';
          tableHeaderDone = true;
        } else {
          html += '    </tr>\n';
        }
        continue;
      }

      // Not a table row — close table if open
      if (inTable) flushTable();

      // Regular paragraph
      if (inList) flushList();
      if (!inParagraph) { html += '<p>'; inParagraph = true; }
      else { html += '\n'; }
      html += this._inline(trimmed);
    }

    flushParagraph();
    flushList();
    flushTable();

    return html;
  },

  /**
   * Process inline Markdown syntax.
   */
  _inline(text) {
    let r = text;

    // Escape HTML entities to prevent XSS
    r = r.replace(/&/g, '&amp;');
    r = r.replace(/</g, '&lt;');
    r = r.replace(/>/g, '&gt;');

    // Bold: **text**
    r = r.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic: *text*
    r = r.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Images: ![alt](url)
    r = r.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" loading="lazy">');

    // Links: [text](url)
    r = r.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>');

    return r;
  }

};
