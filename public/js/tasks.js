const taskInput= document.getElementById('task-input');
const addTaskBtn= document.getElementById('add-task-btn');
const taskList= document.getElementById('task-list-display');

const currentUser = localStorage.getItem('currentUser');
let taskArray = JSON.parse(localStorage.getItem(`tasks-${currentUser}`)) || [];

// === HABIT TRACKER LOGIC ===
const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
const xpKey = `xp-${currentUser}`;
const todayXPKey = `xp-${currentUser}-${today}`;
const lastActiveKey = `lastActive-${currentUser}`;
const streakKey = `streak-${currentUser}`;
const habitKey = `habits-${currentUser}-${today}`;

// Load saved habit states
const savedHabits = JSON.parse(localStorage.getItem(habitKey)) || {};
const xpDisplay = document.getElementById('xp-total');
const streakDisplay = document.getElementById('streak-count');

function updateStatsDisplay() {
  const totalXP = parseInt(localStorage.getItem(xpKey)) || 0;
  const streak = parseInt(localStorage.getItem(streakKey)) || 0;

  xpDisplay.textContent = `XP: ${totalXP}`;
  streakDisplay.textContent = `Streak: ${streak} days`;
}
document.addEventListener('DOMContentLoaded', () => {
  const entryToggle = document.getElementById('entry-toggle');
  const entryDropdown = document.getElementById('entry-dropdown');

  entryToggle.addEventListener('click', () => {
    entryDropdown.classList.toggle('show');
  });

  // Entry type toggle logic (updated for custom dropdown)
  const entryOptions = document.querySelectorAll('.entry-option');
  const addBtn = document.getElementById('add-task-btn');
  let currentEntryType = 'task';

  entryOptions.forEach(option => {
    option.addEventListener('click', () => {
      currentEntryType = option.dataset.type;
      addBtn.textContent = currentEntryType === 'task' ? 'Add Task' : 'Add Habit';
      entryDropdown.classList.remove('show');
    });
  });

  addTaskBtn.addEventListener('click', () => {
    const selectedType = currentEntryType;
    const text = taskInput.value.trim();

    if (text === '') return;

    if (selectedType === 'task') {
      renderTask(text);
      taskArray.push(text);
      localStorage.setItem(`tasks-${currentUser}`, JSON.stringify(taskArray));
      addXP(10);
    } else if (selectedType === 'habit') {
      renderHabit(text);
      addXP(5);
      savedHabits[text] = false;
      localStorage.setItem(habitKey, JSON.stringify(savedHabits));
      updateStatsDisplay();
    }

    taskInput.value = '';
  });

  taskArray.forEach(task => {
    renderTask(task);
  });

  Object.keys(savedHabits).forEach(habit => {
    renderHabit(habit);
  });

  const habitCheckboxes = document.querySelectorAll('#habit-list input[type="checkbox"]');
  habitCheckboxes.forEach((checkbox, index) => {
    const habitName = checkbox.parentElement.textContent.trim();
    checkbox.checked = savedHabits[habitName] || false;

    checkbox.addEventListener('change', () => {
      savedHabits[habitName] = checkbox.checked;
      localStorage.setItem(habitKey, JSON.stringify(savedHabits));
      if (checkbox.checked) {
        addXP(5);
      }
    });
  });
});

function renderTask(taskText) {
  const li = document.createElement('li');
  li.textContent = taskText;

  const completeBtn = document.createElement('button');
  completeBtn.textContent = '✓';
  completeBtn.classList.add('complete-btn');

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✕';
  deleteBtn.classList.add('delete-btn');

  completeBtn.addEventListener('click', () => {
    li.classList.toggle('completed');
  });

  deleteBtn.addEventListener('click', () => {
    li.remove();
    taskArray = taskArray.filter(t => t !== taskText);
    localStorage.setItem(`tasks-${currentUser}`, JSON.stringify(taskArray));
  });

  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

function renderHabit(habitText) {
  const li = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  checkbox.checked = savedHabits[habitText] || false;

  checkbox.addEventListener('change', () => {
    savedHabits[habitText] = checkbox.checked;
    localStorage.setItem(habitKey, JSON.stringify(savedHabits));
    if (checkbox.checked) addXP(5);
  });

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(` ${habitText}`));
  li.appendChild(label);
  document.getElementById('habit-list').appendChild(li);
}

// === XP TRACKING & STREAK LOGIC ===
function addXP(amount) {
  const totalXP = parseInt(localStorage.getItem(xpKey)) || 0;
  const todayXP = parseInt(localStorage.getItem(todayXPKey)) || 0;

  localStorage.setItem(xpKey, totalXP + amount);
  localStorage.setItem(todayXPKey, todayXP + amount);

  // Handle streak tracking
  const lastActive = localStorage.getItem(lastActiveKey);
  const todayDate = today;

  if (lastActive !== todayDate) {
    if (lastActive === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
      const currentStreak = parseInt(localStorage.getItem(streakKey)) || 0;
      localStorage.setItem(streakKey, currentStreak + 1);
    } else {
      localStorage.setItem(streakKey, 1); // reset
    }
    localStorage.setItem(lastActiveKey, todayDate);
  }

  updateStatsDisplay(); // Ensure XP display updates
}
// === GLOBAL HELPERS FOR CHATBOT INTEGRATION ===
// Allow external scripts (e.g., chatbot) to add tasks or habits
window.loggrAddTask = function(text) {
  renderTask(text);
  taskArray.push(text);
  localStorage.setItem(`tasks-${currentUser}`, JSON.stringify(taskArray));
  addXP(10);
};

window.loggrAddHabit = function(text) {
  renderHabit(text);
  savedHabits[text] = false;
  localStorage.setItem(habitKey, JSON.stringify(savedHabits));
  addXP(5);
};