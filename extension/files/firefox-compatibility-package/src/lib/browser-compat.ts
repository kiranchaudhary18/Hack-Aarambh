// browser-compat.js - Place this at the top of your sidepanel and other content scripts

// Ensure consistent API across Chrome and Firefox
if (typeof browser !== 'undefined' && typeof chrome === 'undefined') {
  window.chrome = browser;
}

// Polyfill for older Firefox versions
if (typeof browser !== 'undefined') {
  if (!window.chrome) {
    window.chrome = browser;
  }
  // Add any browser-specific polyfills here
}
