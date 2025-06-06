// js/profile.js (Cleaned up version)

document.addEventListener('DOMContentLoaded', () => {
  // --- USER AUTH & PROFILE DATA ---
  const user = localStorage.getItem('currentUser');
  if (!user) {
    alert("You're not logged in. Redirecting to login page...");
    window.location.href = "/login.html";
    return;
  }

  // Set username
  document.getElementById('profile-username').textContent = user;
  
  // XP and Level Calculation
  const totalXP = parseInt(localStorage.getItem(`xp-${user}`) || 0, 10);
  
  function getLevelFromXP(xp) {
    let level = 1;
    let xpForNextLevel = 100;
    while (xp >= xpForNextLevel) {
      xp -= xpForNextLevel;
      level++;
      xpForNextLevel = 100 + (level - 1) * 20;
    }
    return { level, xpInLevel: xp, xpToNextLevel: xpForNextLevel };
  }
  
  const { level, xpInLevel, xpToNextLevel } = getLevelFromXP(totalXP);
  
  let badge = 'Novice';
  if (level >= 5) badge = 'Learner';
  if (level >= 10) badge = 'Tasker';
  if (level >= 20) badge = 'Master';

  document.getElementById('profile-xp').textContent = `Level ${level} (${badge})`;
  
  const xpBarFill = document.getElementById('xp-bar-fill');
  const xpPercent = Math.min((xpInLevel / xpToNextLevel) * 100, 100);
  xpBarFill.style.width = `${xpPercent}%`;

  // Streak
  const streak = localStorage.getItem(`streak-${user}`) || 0;
  document.getElementById('profile-streak').textContent = `${streak} day${streak !== '1' ? 's' : ''}`;
  

  // --- STREAK CALENDAR GENERATION ---
  const calendarGrid = document.getElementById("calendar-grid");
  if (calendarGrid) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    calendarGrid.innerHTML = '';

    const streakDataKey = `streakDates-${user}`;
    const streakDates = new Set(JSON.parse(localStorage.getItem(streakDataKey)) || []);

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyBox = document.createElement("div");
        calendarGrid.appendChild(emptyBox);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayBox = document.createElement("div");
      dayBox.textContent = day;
      dayBox.className = 'day-box';

      if (streakDates.has(dateStr)) {
        dayBox.classList.add('active');
      }
      calendarGrid.appendChild(dayBox);
    }
  }

  // --- LOGOUT BUTTON ---
  const logoutBtn = document.getElementById('logout-btn');
  if(logoutBtn) {
      logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('currentUser');
          alert('You have been logged out.');
          window.location.href = '/login.html';
      });
  }
});