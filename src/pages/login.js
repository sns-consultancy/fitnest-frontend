/*
 * Handles login form submission.  Saves JWT to localStorage on success
 * and redirects the user to the dashboard.
 */

const API_BASE = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const messageEl = document.getElementById('loginMessage');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageEl.textContent = '';
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('fitness_token', data.token);
        window.location.href = 'dashboard.html';
      } else {
        messageEl.style.color = '#d62828';
        messageEl.textContent = data.error || 'Invalid credentials.';
      }
    } catch (err) {
      messageEl.style.color = '#d62828';
      messageEl.textContent = 'Network error.';
    }
  });
});