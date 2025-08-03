/*
 * Handles sign up form submission on the registration page.
 */

const API_BASE = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const messageEl = document.getElementById('signupMessage');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageEl.textContent = '';
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        messageEl.style.color = '#2a9d8f';
        messageEl.textContent = 'Account created! Please log in.';
      } else {
        messageEl.style.color = '#d62828';
        messageEl.textContent = data.error || 'An error occurred.';
      }
    } catch (err) {
      messageEl.style.color = '#d62828';
      messageEl.textContent = 'Network error.';
    }
  });
});