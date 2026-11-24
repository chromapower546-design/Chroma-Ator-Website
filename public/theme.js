/* ============================================================
   CHROMA-ATOR — THEME SWITCHER
   Persists the visitor's light/dark preference in localStorage.
   ============================================================ */
(function () {
  var STORAGE_KEY = 'chroma_theme';
  var root = document.documentElement;
  var toggles = document.querySelectorAll('[data-theme-toggle]');
  var labels = document.querySelectorAll('[data-theme-label]');
  var metaThemeColor = document.getElementById('meta-theme-color');

  function getTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function syncUI(theme) {
    var isDark = theme === 'dark';
    var nextLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';

    Array.prototype.forEach.call(toggles, function (button) {
      button.setAttribute('aria-pressed', String(isDark));
      button.setAttribute('aria-label', nextLabel);
      button.setAttribute('title', nextLabel);
    });

    Array.prototype.forEach.call(labels, function (label) {
      label.textContent = isDark ? 'Light mode' : 'Dark mode';
    });

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#07100C' : '#F3F5F2');
    }
  }

  function applyTheme(theme, persist) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {
        /* Private browsing or storage disabled — theme still applies for this page. */
      }
    }

    syncUI(theme);
  }

  Array.prototype.forEach.call(toggles, function (button) {
    button.addEventListener('click', function () {
      applyTheme(getTheme() === 'dark' ? 'light' : 'dark', true);
    });
  });

  // Keep multiple tabs in sync when the preference changes elsewhere.
  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY) {
      applyTheme(event.newValue === 'dark' ? 'dark' : 'light', false);
    }
  });

  syncUI(getTheme());
})();
