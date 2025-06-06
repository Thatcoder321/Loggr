// js/global.js (Updated with Mobile Menu Logic)

document.addEventListener('DOMContentLoaded', () => {

    // --- THEME MANAGEMENT ---
    function applyTheme(theme) { /* ... same as before ... */ }
    function updateThemeButtons(theme) { /* ... same as before ... */ }
    // (Functions hidden for brevity, but they are in the full code block)
    function applyTheme(theme) { document.body.setAttribute('data-theme', theme); }
    function updateThemeButtons(theme) { const themeButtons = document.querySelectorAll('.theme-btn'); themeButtons.forEach(btn => { if (btn.dataset.theme === theme) { btn.classList.add('active'); } else { btn.classList.remove('active'); } }); }
    const savedTheme = localStorage.getItem('user-theme') || 'default';
    applyTheme(savedTheme);
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        updateThemeButtons(savedTheme);
        themeSelector.addEventListener('click', (event) => {
            const button = event.target.closest('.theme-btn');
            if (button) {
                const theme = button.dataset.theme;
                localStorage.setItem('user-theme', theme);
                applyTheme(theme);
                updateThemeButtons(theme);
            }
        });
    }

    // ===============================================
    // --- NEW: MOBILE NAVIGATION LOGIC ---
    // ===============================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
        });

        // Optional: Close menu when a link is clicked
        sidebar.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                sidebar.classList.remove('is-open');
            }
        });
    }
});