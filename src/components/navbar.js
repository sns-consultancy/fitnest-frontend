/*
 * Navbar functionality.  Currently unused but could be extended to
 * highlight active sections or handle navigation across pages.
 */

// Example: highlight active link based on current path
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('nav a');
  const current = window.location.pathname;
  links.forEach((link) => {
    if (link.getAttribute('href') === current) {
      link.style.fontWeight = 'bold';
    }
  });
});