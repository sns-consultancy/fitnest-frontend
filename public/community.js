/*
 * Simple community chat using localStorage for persistence and
 * canned bot responses.
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'community_messages';
  const messagesEl = document.getElementById('messages');
  const input = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');

  let messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }

  function appendMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add(type);
    msgDiv.textContent = text;
    messagesEl.appendChild(msgDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function renderExisting() {
    messages.forEach((m) => appendMessage(m.text, m.type));
  }

  function getBotResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    if (msg.includes('hello') || msg.includes('hi')) {
      return 'Hello! Welcome to the community.';
    }
    if (msg.includes('workout')) {
      return 'Share your favorite workouts with others!';
    }
    if (msg.includes('meal')) {
      return 'Healthy meals keep you energized. What did you eat today?';
    }
    if (msg.includes('goal')) {
      return 'Stay focused on your goals. You can do it!';
    }
    return "Thanks for sharing! (This is a demo chat without backend.)";
  }

  renderExisting();

  sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    messages.push({ text, type: 'user' });
    save();
    input.value = '';
    setTimeout(() => {
      const reply = getBotResponse(text);
      appendMessage(reply, 'bot');
      messages.push({ text: reply, type: 'bot' });
      save();
    }, 500);
  });

  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });
});

