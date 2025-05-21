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
  
      const botBubble = document.createElement('div');
      botBubble.classList.add('message', 'bot');
  
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      .then(res => res.json())
      .then(data => {
        try {
          const parsed = JSON.parse(data.result);
          if (parsed.type && parsed.item) {
            if (parsed.type === 'task') {
              loggrAddTask(parsed.item);
            } else if (parsed.type === 'habit') {
              loggrAddHabit(parsed.item);
            }
            botBubble.textContent = `✅ Added ${parsed.type}: ${parsed.item}`;
            const listItem = document.createElement('li');
            listItem.textContent = parsed.item;
            document.getElementById('task-preview-list').appendChild(listItem);
          } else {
            botBubble.textContent = "⚠️ Sorry, I couldn't understand what to add.";
          }
        } catch (e) {
          botBubble.textContent = "⚠️ Error parsing response.";
        }
        chatLog.appendChild(botBubble);
      })
      .catch(err => {
        botBubble.textContent = "⚠️ AI backend error.";
        chatLog.appendChild(botBubble);
      });
  
      chatInput.value = '';
    });
  });