document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
  
    if (!loginForm) {
      console.error('Login form not found!');
      return;
    }
  
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const username = usernameInput.value.trim();
      const password = passwordInput.value;
  
      const users = JSON.parse(localStorage.getItem('users')) || {};
  
      if (users[username]) {
        const isPasswordCorrect = await sha256(password) === users[username];
        if (isPasswordCorrect) {
          localStorage.setItem('currentUser', username);
          window.location.href = 'dashboard.html';
        } else {
          alert('Incorrect password');
        }
      } else {
        const hashedPassword = await sha256(password);
        users[username] = hashedPassword;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', username);
        window.location.href = 'dashboard.html';
      }
    });
  
    async function sha256(str) {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      return [...new Uint8Array(hashBuffer)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
  });