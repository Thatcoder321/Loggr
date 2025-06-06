
// --- Task Persistence ---
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

    if (tasks.length === 0) {
        
        return;
    }
    
    tasks.forEach(task => {
        const itemClass = task.completed ? 'task-item completed' : 'task-item';
        const checkboxClass = task.completed ? 'checkbox checked' : 'checkbox';
        const checkmark = task.completed ? '✓' : '';

        const newItem = document.createElement('div');
        newItem.className = itemClass;
        newItem.dataset.id = task.id; 

        newItem.innerHTML = `
            <div class="${checkboxClass}" role="button" tabindex="0">${checkmark}</div>
            <div class="task-details">
                <h4>${task.name}</h4>
                ${task.dueDate ? `<span class="due-date">Due: ${new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}</span>` : ''}
            </div>
            <div class="task-actions">
                <button class="task-delete-btn" aria-label="Delete task">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        `;
        container.appendChild(newItem);
    });
}

// --- Habit Persistence ---
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
        newItem.dataset.index = index;

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
    function updateEntryFields() { if (entryTypeSelect.value === 'habit') { taskFields.classList.add('hidden'); habitFields.classList.remove('hidden'); } else { taskFields.classList.remove('hidden'); habitFields.classList.add('hidden'); } }
    function openModal() { updateEntryFields(); modal.classList.remove('hidden'); modal.querySelector('select, input, button:not(.close-button)')?.focus(); }
    function closeModal() { modal.classList.add('hidden'); }
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    entryTypeSelect.addEventListener('change', updateEntryFields);
    window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.classList.contains('hidden')) { closeModal(); } });
    modal.addEventListener('click', (event) => { if (event.target === modal) { closeModal(); } });
    
    // Form submission handles both types
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const type = formData.get('entry-type');
        const name = formData.get('entry-name');

        if (type === 'habit') {
            const habits = loadHabits();
            habits.push({ name: name, streak: 0, lastCompleted: null });
            saveHabits(habits);
            renderSavedHabits();
        } else { // It's a task
            const dueDate = formData.get('due-date');
            const tasks = loadTasks();
            tasks.push({ id: Date.now(), name: name, dueDate: dueDate || null, completed: false });
            saveTasks(tasks);
            renderSavedTasks();
        }
        form.reset();
        closeModal();
    });

    // =========================================================
    // THIS IS THE CORRECTED EVENT LISTENER BLOCK
    // =========================================================
    document.body.addEventListener('click', function(event) {
        
        // --- Handle Task Checkbox Click ---
        const checkbox = event.target.closest('.checkbox');
        if (checkbox) {
            const taskItem = checkbox.closest('.task-item');
            if (taskItem) {
                const taskId = Number(taskItem.dataset.id);
                let tasks = loadTasks();
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    task.completed = !task.completed; // Toggle the completed state
                    saveTasks(tasks);
                    renderSavedTasks(); // Re-render the UI
                }
            }
            return; // Stop processing after handling this click
        }

        // --- Handle Task Delete Button Click ---
        const deleteBtn = event.target.closest('.task-delete-btn');
        if (deleteBtn) {
            const taskItem = deleteBtn.closest('.task-item');
            if (taskItem) {
                const taskId = Number(taskItem.dataset.id);
                let tasks = loadTasks();
                tasks = tasks.filter(t => t.id !== taskId); // Filter out the deleted task
                saveTasks(tasks);
                renderSavedTasks(); // Re-render the UI
            }
            return; // Stop processing
        }

        // --- Handle Habit Completion Click ---
        const habitButton = event.target.closest('.complete-habit-btn');
        if (habitButton) {
            const item = habitButton.closest('.habit-item');
            const habitIndex = item.dataset.index;
            const habits = loadHabits();
            const habit = habits[habitIndex];
            
            if (!habit) return;

            const today = new Date().toISOString().split('T')[0];
            
            if (habit.lastCompleted !== today) {
                habit.streak = (habit.streak || 0) + 1;
                habit.lastCompleted = today;
                saveHabits(habits);
                renderSavedHabits();
            } else {
                habitButton.classList.add('pulsing');
                setTimeout(() => { habitButton.classList.remove('pulsing'); }, 300);
            }
            return; // Stop processing
        }
    });
});