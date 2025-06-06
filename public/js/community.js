// js/community.js (Corrected Version)

document.addEventListener('DOMContentLoaded', () => {
    const leaderboardList = document.getElementById('leaderboard-list');
    if (!leaderboardList) return;

    // --- CRITICAL FIX: Clear any hardcoded HTML from the list first ---
    leaderboardList.innerHTML = '';

    // Find all users that have data in THIS BROWSER'S localStorage
    const users = Object.keys(localStorage)
        .filter(key => key.startsWith('xp-'))
        .map(key => {
            const username = key.replace('xp-', '');
            const xp = parseInt(localStorage.getItem(key), 10) || 0;
            const streak = parseInt(localStorage.getItem(`streak-${username}`), 10) || 0;
            
            // --- Level Calculation (copied from profile.js for consistency) ---
            let level = 1;
            let xpForNextLevel = 100;
            let xpInLevel = xp;
            
            while (xpInLevel >= xpForNextLevel) {
                xpInLevel -= xpForNextLevel;
                level++;
                xpForNextLevel = 100 + (level - 1) * 20;
            }
            // ---
            
            return { username, xp, streak, level };
        });

    // Sort users by XP (highest first), then by streak as a tie-breaker
    users.sort((a, b) => b.xp - a.xp || b.streak - a.streak);

    // If no users are found in localStorage, show a message
    if (users.length === 0) {
        leaderboardList.innerHTML = '<li>No user data found in this browser. Complete some tasks to appear here!</li>';
        return;
    }
    
    // Display the sorted users
    users.forEach((user, index) => {
        const li = document.createElement('li');
        let medal = '';
        if (index === 0) medal = '🥇 ';
        if (index === 1) medal = '🥈 ';
        if (index === 2) medal = '🥉 ';
        
        li.textContent = `${medal}${user.username} – Level ${user.level} (XP: ${user.xp}), Streak: ${user.streak} days`;
        leaderboardList.appendChild(li);
    });
});