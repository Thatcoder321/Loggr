document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatLog = document.getElementById('chat-log');
  
    chatSend.addEventListener('click', () => {
      const message = chatInput.value.trim();
      if (!message) return;
  
      const userBubble = document.createElement('div');
      userBubble.textContent = message;
      userBubble.classList.add('message', 'user');
      chatLog.appendChild(userBubble);
  
      // Simulated AI interpretation
      const lower = message.toLowerCase();
      let addedType = null;
      let parsedItem = null;
  
      if (lower.includes("add") && lower.includes("task")) {
        addedType = "task";
        parsedItem = message.split("task")[1]?.trim() || null;
      } else if (lower.includes("add") && lower.includes("habit")) {
        addedType = "habit";
        parsedItem = message.split("habit")[1]?.trim() || null;
      }
  
      const botBubble = document.createElement('div');
      botBubble.classList.add('message', 'bot');
  
      if (addedType && parsedItem) {
        botBubble.textContent = `✅ Added ${addedType}: ${parsedItem}`;
        const listItem = document.createElement('li');
        listItem.textContent = parsedItem;
        document.getElementById('task-preview-list').appendChild(listItem);
      } else {
        botBubble.textContent = "⚠️ Sorry, I couldn't understand what to add. Try using 'add task' or 'add habit'.";
      }
  
      chatLog.appendChild(botBubble);
      chatInput.value = '';
    });
  });