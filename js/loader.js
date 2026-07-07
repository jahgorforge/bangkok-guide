/*
 * loader.js — Fetches JSON files and parses URL parameters.
 */

const Loader = {
  /**
   * Fetch a JSON file and return the parsed data.
   * @param {string} path - Path to the JSON file.
   * @returns {Promise<Array|Object>}
   */
  async fetchJSON(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`Loader: Failed to load ${path} —`, err.message);
      return null;
    }
  },

  /**
   * Fetch a text file and return its content.
   * @param {string} path - Path to the text file.
   * @returns {Promise<string>}
   */
  async fetchText(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.text();
    } catch (err) {
      console.warn(`Loader: Failed to load ${path} —`, err.message);
      return '';
    }
  },

  /**
   * Get a URL parameter by name.
   * @param {string} name - Parameter name.
   * @returns {string|null}
   */
  getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }
};
