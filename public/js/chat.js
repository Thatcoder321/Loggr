// js/chat.js (Corrected and Functional Version)

document.addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatLog = document.getElementById('chat-log');
  const taskPreviewList = document.getElementById('task-preview-list');

  if (!chatInput || !chatSend || !chatLog || !taskPreviewList) {
      console.error("Chat UI element not found. Chat disabled.");
      return;
  }

  // --- Helper functions to interact with localStorage ---
  // (These are copied from main.js to make this file self-sufficient)
  function loadData(key) {
      const username = localStorage.getItem('currentUser') || 'default';
      return JSON.parse(localStorage.getItem(`${key}_${username}`)) || [];
  }

  function saveData(key, data) {
      const username = localStorage.getItem('currentUser') || 'default';
      localStorage.setItem(`${key}_${username}`, JSON.stringify(data));
  }

  // --- Main Chat Logic ---
  async function handleSendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;

      // Display user's message immediately
      const userBubble = document.createElement('div');
      userBubble.textContent = message;
      userBubble.classList.add('message', 'user');
      chatLog.appendChild(userBubble);
      chatLog.scrollTop = chatLog.scrollHeight; // Scroll to bottom
      chatInput.value = '';

      try {
          const response = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message })
          });
          
          if (!response.ok) {
              throw new Error(`Server responded with ${response.status}`);
          }

          const data = await response.json(); // Vercel already gives us a parsed object

          const botBubble = document.createElement('div');
          botBubble.classList.add('message', 'bot');

          // **FIXED LOGIC:** Directly check the properties of the 'data' object
          if (data && data.type && data.item) {
              if (data.type === 'task') {
                  const tasks = loadData('tasks');
                  tasks.push({ name: data.item, dueDate: null });
                  saveData('tasks', tasks);
              } else if (data.type === 'habit') {
                  const habits = loadData('habits');
                  habits.push({ name: data.item, streak: 0, lastCompleted: null });
                  saveData('habits', habits);
              }

              botBubble.textContent = `✅ Added ${data.type}: "${data.item}"`;
              
              // Add to the preview list on the side
              const listItem = document.createElement('li');
              listItem.textContent = data.item;
              taskPreviewList.appendChild(listItem);

          } else {
              botBubble.textContent = "⚠️ Sorry, I couldn't understand that. Please try again, like 'add a task to walk the dog'.";
          }
          chatLog.appendChild(botBubble);

      } catch (err) {
          console.error('Chat Error:', err);
          const errorBubble = document.createElement('div');
          errorBubble.classList.add('message', 'bot');
          errorBubble.textContent = "⚠️ An AI backend error occurred. Please check the Vercel logs or API Key.";
          chatLog.appendChild(errorBubble);
      }
      
      chatLog.scrollTop = chatLog.scrollHeight; // Scroll to bottom again
  }

  chatSend.addEventListener('click', handleSendMessage);
  chatInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
          handleSendMessage();
      }
  });
});