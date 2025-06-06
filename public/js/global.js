// This script runs on every page to manage the site-wide theme

document.addEventListener('DOMContentLoaded', () => {

    // Function to apply a theme to the entire site
    function applyTheme(theme) {
      document.body.setAttribute('data-theme', theme);
    }
  
    // Function to handle the active state of theme buttons
    function updateThemeButtons(theme) {
      const themeButtons = document.querySelectorAll('.theme-btn');
      themeButtons.forEach(btn => {
        if (btn.dataset.theme === theme) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  
    // --- Main Logic ---
  
    // 1. Apply the saved theme on page load
    const savedTheme = localStorage.getItem('user-theme') || 'default';
    applyTheme(savedTheme);
  
    // 2. Add event listeners ONLY if theme buttons exist on the current page (i.e., profile page)
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
      updateThemeButtons(savedTheme); // Set initial active button state
  
      themeSelector.addEventListener('click', (event) => {
        const button = event.target.closest('.theme-btn');
        if (button) {
          const theme = button.dataset.theme;
          localStorage.setItem('user-theme', theme); // Save the new choice
          applyTheme(theme);
          updateThemeButtons(theme);
        }
      });
    }
  });