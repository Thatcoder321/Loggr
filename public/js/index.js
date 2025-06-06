document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const currentUser = localStorage.getItem('currentUser');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (currentUser) {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }
});