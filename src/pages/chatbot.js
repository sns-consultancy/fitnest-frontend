/*
 * Simple client‑side chatbot for demonstration purposes.
 * This bot does not connect to any AI service; instead it
 * returns canned responses based on keywords.  You can extend
 * this script to integrate with a real backend or API.
 */

document.addEventListener('DOMContentLoaded', () => {
  const messagesEl = document.getElementById('messages');
  const input = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');

  function appendMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add(type);
    msgDiv.textContent = text;
    messagesEl.appendChild(msgDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function getBotResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    if (msg.includes('hello') || msg.includes('hi')) {
      return 'Hello! How can I assist you with your fitness goals?';
    }
    if (msg.includes('workout')) {
      return 'Remember to vary your workouts to target different muscle groups. Need help logging a workout?';
    }
    if (msg.includes('meal')) {
      return 'Proper nutrition fuels your workouts! You can add your meals on the dashboard.';
    }
    if (msg.includes('goal')) {
      return 'Setting clear and realistic goals is crucial. On your dashboard you can set goals for weight, steps, or any target you like.';
    }
    return "I'm sorry, I didn't understand that. Try asking about workouts, meals or goals.";
  }

  sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    input.value = '';
    setTimeout(() => {
      const reply = getBotResponse(text);
      appendMessage(reply, 'bot');
    }, 500);
  });

  // allow pressing Enter to send
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });
});