/*
 * Homepage script.  Shows a greeting if the user is already logged in.
 */
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('fitness_token');
  if (token) {
    // Insert a welcome message dynamically
    const h1 = document.querySelector('h1');
    const p = document.createElement('p');
    p.textContent = 'Welcome back! Visit your dashboard to continue tracking.';
    p.style.marginTop = '10px';
    h1.after(p);
  }
});