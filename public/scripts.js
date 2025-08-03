/*
 * Client‑side JavaScript for the fitness app.  Handles registration,
 * authentication, and CRUD operations for workouts, meals and goals.
 */

// Backend base URL – adjust if your Python server runs on another host/port.
const API_BASE = 'http://localhost:5000';

// Helper to parse JSON responses safely
async function parseJSON(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    return text;
  }
}

// Signup logic
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('signupMessage');
    messageEl.textContent = '';
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await parseJSON(res);
      if (res.ok) {
        messageEl.style.color = '#2a9d8f';
        messageEl.textContent = 'Account created! You can now log in.';
      } else {
        messageEl.style.color = '#d62828';
        messageEl.textContent = data.error || 'An error occurred.';
      }
    } catch (err) {
      messageEl.style.color = '#d62828';
      messageEl.textContent = 'Network error. Please try again.';
    }
  });
}

// Login logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('loginMessage');
    messageEl.textContent = '';
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await parseJSON(res);
      if (res.ok) {
        // Save JWT token and redirect to dashboard
        localStorage.setItem('fitness_token', data.token);
        window.location.href = 'dashboard.html';
      } else {
        messageEl.style.color = '#d62828';
        messageEl.textContent = data.error || 'Invalid credentials.';
      }
    } catch (err) {
      messageEl.style.color = '#d62828';
      messageEl.textContent = 'Network error. Please try again.';
    }
  });
}

// Dashboard logic
const workoutsBtn = document.getElementById('workoutsBtn');
const mealsBtn = document.getElementById('mealsBtn');
const goalsBtn = document.getElementById('goalsBtn');

// Only run if we are on the dashboard page
if (workoutsBtn && mealsBtn && goalsBtn) {
  const workoutSection = document.getElementById('workoutsSection');
  const mealSection = document.getElementById('mealsSection');
  const goalSection = document.getElementById('goalsSection');

  function showSection(section) {
    workoutSection.classList.remove('active');
    mealSection.classList.remove('active');
    goalSection.classList.remove('active');
    section.classList.add('active');
  }

  workoutsBtn.addEventListener('click', () => showSection(workoutSection));
  mealsBtn.addEventListener('click', () => showSection(mealSection));
  goalsBtn.addEventListener('click', () => showSection(goalSection));

  // Show workouts by default
  showSection(workoutSection);

  // Helper to get auth header
  function authHeaders() {
    const token = localStorage.getItem('fitness_token');
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  }

  // Redirect to login if not authenticated
  (function ensureLoggedIn() {
    const token = localStorage.getItem('fitness_token');
    if (!token) {
      window.location.href = 'login.html';
    }
  })();

  // Fetch and render existing entries
  async function loadData() {
    await Promise.all([loadWorkouts(), loadMeals(), loadGoals()]);
  }

  async function loadWorkouts() {
    const listEl = document.getElementById('workoutsList');
    listEl.textContent = '';
    try {
      const res = await fetch(`${API_BASE}/workouts`, { headers: authHeaders() });
      const data = await parseJSON(res);
      if (res.ok) {
        if (data.length === 0) {
          listEl.textContent = 'No workouts logged yet.';
        } else {
          const ul = document.createElement('ul');
          data.forEach((w) => {
            const li = document.createElement('li');
            li.textContent = `${w.date} – ${w.name} (${w.duration} min)`;
            ul.appendChild(li);
          });
          listEl.appendChild(ul);
        }
      } else {
        listEl.textContent = data.error || 'Could not load workouts.';
      }
    } catch (err) {
      listEl.textContent = 'Network error.';
    }
  }

  async function loadMeals() {
    const listEl = document.getElementById('mealsList');
    listEl.textContent = '';
    try {
      const res = await fetch(`${API_BASE}/meals`, { headers: authHeaders() });
      const data = await parseJSON(res);
      if (res.ok) {
        if (data.length === 0) {
          listEl.textContent = 'No meals logged yet.';
        } else {
          const ul = document.createElement('ul');
          data.forEach((m) => {
            const li = document.createElement('li');
            li.textContent = `${m.date} – ${m.name} (${m.calories} cal)`;
            ul.appendChild(li);
          });
          listEl.appendChild(ul);
        }
      } else {
        listEl.textContent = data.error || 'Could not load meals.';
      }
    } catch (err) {
      listEl.textContent = 'Network error.';
    }
  }

  async function loadGoals() {
    const listEl = document.getElementById('goalsList');
    listEl.textContent = '';
    try {
      const res = await fetch(`${API_BASE}/goals`, { headers: authHeaders() });
      const data = await parseJSON(res);
      if (res.ok) {
        if (data.length === 0) {
          listEl.textContent = 'No goals set yet.';
        } else {
          const ul = document.createElement('ul');
          data.forEach((g) => {
            const li = document.createElement('li');
            li.textContent = `${g.type}: ${g.target}`;
            ul.appendChild(li);
          });
          listEl.appendChild(ul);
        }
      } else {
        listEl.textContent = data.error || 'Could not load goals.';
      }
    } catch (err) {
      listEl.textContent = 'Network error.';
    }
  }

  // Submit workout
  document.getElementById('submitWorkout').addEventListener('click', async () => {
    const name = document.getElementById('workoutName').value.trim();
    const date = document.getElementById('workoutDate').value;
    const duration = parseInt(document.getElementById('workoutDuration').value, 10);
    const messageEl = document.getElementById('workoutMessage');
    messageEl.textContent = '';
    if (!name || !date || !duration) {
      messageEl.textContent = 'Please fill in all fields.';
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/workouts`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name, date, duration })
      });
      const data = await parseJSON(res);
      if (res.ok) {
        document.getElementById('workoutName').value = '';
        document.getElementById('workoutDate').value = '';
        document.getElementById('workoutDuration').value = '';
        messageEl.style.color = '#2a9d8f';
        messageEl.textContent = 'Workout added!';
        loadWorkouts();
      } else {
        messageEl.style.color = '#d62828';
        messageEl.textContent = data.error || 'Error adding workout.';
      }
    } catch (err) {
      messageEl.style.color = '#d62828';
      messageEl.textContent = 'Network error.';
    }
  });

  // Submit meal
  document.getElementById('submitMeal').addEventListener('click', async () => {
    const name = document.getElementById('mealName').value.trim();
    const date = document.getElementById('mealDate').value;
    const calories = parseInt(document.getElementById('mealCalories').value, 10);
    const messageEl = document.getElementById('mealMessage');
    messageEl.textContent = '';
    if (!name || !date || !calories) {
      messageEl.textContent = 'Please fill in all fields.';
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/meals`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name, date, calories })
      });
      const data = await parseJSON(res);
      if (res.ok) {
        document.getElementById('mealName').value = '';
        document.getElementById('mealDate').value = '';
        document.getElementById('mealCalories').value = '';
        messageEl.style.color = '#2a9d8f';
        messageEl.textContent = 'Meal added!';
        loadMeals();
      } else {
        messageEl.style.color = '#d62828';
        messageEl.textContent = data.error || 'Error adding meal.';
      }
    } catch (err) {
      messageEl.style.color = '#d62828';
      messageEl.textContent = 'Network error.';
    }
  });

  // Submit goal
  document.getElementById('submitGoal').addEventListener('click', async () => {
    const type = document.getElementById('goalType').value.trim();
    const target = document.getElementById('goalTarget').value.trim();
    const messageEl = document.getElementById('goalMessage');
    messageEl.textContent = '';
    if (!type || !target) {
      messageEl.textContent = 'Please fill in all fields.';
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/goals`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ type, target })
      });
      const data = await parseJSON(res);
      if (res.ok) {
        document.getElementById('goalType').value = '';
        document.getElementById('goalTarget').value = '';
        messageEl.style.color = '#2a9d8f';
        messageEl.textContent = 'Goal set!';
        loadGoals();
      } else {
        messageEl.style.color = '#d62828';
        messageEl.textContent = data.error || 'Error setting goal.';
      }
    } catch (err) {
      messageEl.style.color = '#d62828';
      messageEl.textContent = 'Network error.';
    }
  });

  // Logout handler
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('fitness_token');
    window.location.href = 'login.html';
  });

  // Initial load
  loadData();
}