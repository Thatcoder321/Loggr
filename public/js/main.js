
function loadTasks() {
    const username = localStorage.getItem('currentUser') || 'default';
    return JSON.parse(localStorage.getItem(`tasks_${username}`)) || [];
}

function saveTasks(tasks) {
    const username = localStorage.getItem('currentUser') || 'default';
    localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));
}

function renderSavedTasks() {
    const container = document.querySelector('.task-list');
    if (!container) return;
    container.innerHTML = '';
    const tasks = loadTasks();
    tasks.forEach(task => {
        let newItem = document.createElement('div');
        newItem.className = 'task-item';
        newItem.innerHTML = `
            <div class="checkbox"></div>
            <div class="task-details">
                <h4>${task.name}</h4>
                ${task.dueDate ? `<span class="due-date">Due: ${new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}</span>` : ''}
            </div>
        `;
        container.appendChild(newItem);
    });
}

// --- NEW: Habit Persistence ---
function loadHabits() {
    const username = localStorage.getItem('currentUser') || 'default';
    return JSON.parse(localStorage.getItem(`habits_${username}`)) || [];
}

function saveHabits(habits) {
    const username = localStorage.getItem('currentUser') || 'default';
    localStorage.setItem(`habits_${username}`, JSON.stringify(habits));
}

function renderSavedHabits() {
    const container = document.querySelector('.habit-list');
    if (!container) return;
    container.innerHTML = '';
    const habits = loadHabits();
    const today = new Date().toISOString().split('T')[0];

    habits.forEach((habit, index) => {
        const newItem = document.createElement('div');
        newItem.className = 'habit-item';
        newItem.dataset.index = index; // IMPORTANT: Give each habit an index

        const isCompletedToday = habit.lastCompleted === today;
        const progressBarWidth = isCompletedToday ? '100%' : '0%';
        const buttonClass = isCompletedToday ? 'completed-today' : '';
        const buttonIcon = isCompletedToday
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;

        newItem.innerHTML = `
            <div class="habit-icon">✨</div>
            <div class="habit-details">
                <h4>${habit.name}</h4>
                <span class="streak">Streak: ${habit.streak || 0} days</span>
                <div class="progress-bar-container habit-progress">
                    <div class="progress-bar" style="width: ${progressBarWidth};"></div>
                </div>
            </div>
            <button class="complete-habit-btn ${buttonClass}" aria-label="Complete habit for today">
                ${buttonIcon}
            </button>
        `;
        container.appendChild(newItem);
    });
}


// =================================================================
// MAIN SCRIPT (Runs after the DOM is fully loaded)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Initial Page Setup ---
    const header = document.querySelector('.main-header h1');
    if (header) {
        const hour = new Date().getHours();
        let greeting = "Good Day";
        if (hour < 12) { greeting = "Good Morning"; }
        else if (hour < 18) { greeting = "Good Afternoon"; }
        else { greeting = "Good Evening"; }
        let username = localStorage.getItem('currentUser') || 'User';
        header.textContent = `${greeting}, ${username}`;
    }

    const settingsBtn = document.querySelector('.settings-icon');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => { window.location.href = "profile.html"; });
    }

    // NEW: Render both tasks and habits on load
    renderSavedTasks();
    renderSavedHabits();

    // --- Modal Elements & Logic ---
    const modal = document.getElementById('add-task-modal');
    const openBtn = document.querySelector('.add-task-bar');
    if (!modal || !openBtn) { return; }

    const closeBtn = modal.querySelector('.close-button');
    const form = modal.querySelector('#add-entry-form');
    const entryTypeSelect = modal.querySelector('#entry-type');
    const taskFields = modal.querySelector('#task-fields');
    const habitFields = modal.querySelector('#habit-fields');

    function updateEntryFields() {
        if (entryTypeSelect.value === 'habit') {
            taskFields.classList.add('hidden');
            habitFields.classList.remove('hidden');
        } else {
            taskFields.classList.remove('hidden');
            habitFields.classList.add('hidden');
        }
    }

    function openModal() {
        updateEntryFields();
        modal.classList.remove('hidden');
        modal.querySelector('select, input, button:not(.close-button)')?.focus();
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    // --- Event Listeners ---
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    entryTypeSelect.addEventListener('change', updateEntryFields);

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) { closeModal(); }
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) { closeModal(); }
    });

    // Form submission now handles saving both types
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const type = formData.get('entry-type');
        const name = formData.get('entry-name');

        if (type === 'habit') {
            const habits = loadHabits();
            habits.push({
                name: name,
                streak: 0,
                lastCompleted: null // Initialize with no completion date
            });
            saveHabits(habits);
            renderSavedHabits(); // Re-render the list with the new habit
        } else { // It's a task
            const dueDate = formData.get('due-date');
            const tasks = loadTasks();
            tasks.push({ name: name, dueDate: dueDate || null });
            saveTasks(tasks);
            renderSavedTasks();
        }

        form.reset();
        closeModal();
    });

    // UPDATED: Repeatable Habit Completion Logic now saves changes
    document.body.addEventListener('click', function(event) {
        const habitButton = event.target.closest('.complete-habit-btn');
        if (!habitButton) return;

        const item = habitButton.closest('.habit-item');
        const habitIndex = item.dataset.index;
        const habits = loadHabits();
        const habit = habits[habitIndex];
        
        if (!habit) return; // Safety check

        const today = new Date().toISOString().split('T')[0];
        
        if (habit.lastCompleted === today) {
            
            habitButton.classList.add('pulsing');
            setTimeout(() => { habitButton.classList.remove('pulsing'); }, 300);
        } else {
            // First completion for today
            habit.streak = (habit.streak || 0) + 1;
            habit.lastCompleted = today;
            
            // Save the entire updated habits array
            saveHabits(habits);
            
            // Re-render the UI from the saved data
            renderSavedHabits();
        }
    });
});