document.addEventListener('DOMContentLoaded', () => {
    const leaderboardList = document.getElementById('leaderboard-list');

    if(!leaderboardList) return;
    const users = Object.keys(localStorage)
    .filter(key => key.startsWith('xp-'))
    .map(key => {
        const username = key.replace('xp-', '');
        const xp = parseInt(localStorage.getItem(key), 10) || 0;
        const streak = parseInt(localStorage.getItem(`streak-${username}`), 10) || 0;
        

        let level = 1;
        let xpRemaning = xp;
        let xpRequired = 100;
        while (xpRemaning >= xpRequired) {
            xpRemaning -= xpRequired;
            level++;
            xpRequired = 100 + (level - 1) * 10;
        }
        return { username, xp, streak, level };
        
    });

    users.sort((a, b) => b.xp - a.xp || b.streak - a.streak);

    users.forEach(user => {
        const li = document.createElement('li');   
        li.textContent = `${user.username} – Level ${user.level}, XP: ${user.xp}, Streak: ${user.streak} day${user.streak !== 1 ? 's' : ''}`;
        leaderboardList.appendChild(li);
    });
});