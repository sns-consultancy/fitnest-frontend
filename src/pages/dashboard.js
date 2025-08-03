/*
 * Dashboard script.  Provides CRUD functionality for workouts,
 * meals and goals.  Requires the user to be authenticated.
 */

const API_BASE = 'http://localhost:5000';

// Only run when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('fitness_token');
  if (!token) {
    // Not logged in – redirect to login
    window.location.href = 'login.html';
    return;
  }

  // Section elements
  const workoutSection = document.getElementById('workoutsSection');
  const mealSection = document.getElementById('mealsSection');
  const goalSection = document.getElementById('goalsSection');
  const workoutsBtn = document.getElementById('workoutsBtn');
  const mealsBtn = document.getElementById('mealsBtn');
  const goalsBtn = document.getElementById('goalsBtn');

  // Function to show/hide sections
  function showSection(section) {
    workoutSection.classList.remove('active');
    mealSection.classList.remove('active');
    goalSection.classList.remove('active');
    section.classList.add('active');
  }

  // Attach navigation buttons
  workoutsBtn.addEventListener('click', () => showSection(workoutSection));
  mealsBtn.addEventListener('click', () => showSection(mealSection));
  goalsBtn.addEventListener('click', () => showSection(goalSection));

  // Show workouts by default
  showSection(workoutSection);

  // Helper: auth headers
  function authHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('fitness_token')}`
    };
  }

  // Load data
  async function loadData() {
    await Promise.all([loadWorkouts(), loadMeals(), loadGoals()]);
  }

  async function loadWorkouts() {
    const list = document.getElementById('workoutsList');
    list.textContent = '';
    try {
      const res = await fetch(`${API_BASE}/workouts`, { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) {
        if (data.length === 0) {
          list.textContent = 'No workouts logged yet.';
        } else {
          const ul = document.createElement('ul');
          data.forEach((w) => {
            const li = document.createElement('li');
            li.textContent = `${w.date} – ${w.name} (${w.duration} min)`;
            ul.appendChild(li);
          });
          list.appendChild(ul);
        }
      } else {
        list.textContent = data.error || 'Error loading workouts.';
      }
    } catch (err) {
      list.textContent = 'Network error.';
    }
  }

  async function loadMeals() {
    const list = document.getElementById('mealsList');
    list.textContent = '';
    try {
      const res = await fetch(`${API_BASE}/meals`, { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) {
        if (data.length === 0) {
          list.textContent = 'No meals logged yet.';
        } else {
          const ul = document.createElement('ul');
          data.forEach((m) => {
            const li = document.createElement('li');
            li.textContent = `${m.date} – ${m.name} (${m.calories} cal)`;
            ul.appendChild(li);
          });
          list.appendChild(ul);
        }
      } else {
        list.textContent = data.error || 'Error loading meals.';
      }
    } catch (err) {
      list.textContent = 'Network error.';
    }
  }

  async function loadGoals() {
    const list = document.getElementById('goalsList');
    list.textContent = '';
    try {
      const res = await fetch(`${API_BASE}/goals`, { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) {
        if (data.length === 0) {
          list.textContent = 'No goals set yet.';
        } else {
          const ul = document.createElement('ul');
          data.forEach((g) => {
            const li = document.createElement('li');
            li.textContent = `${g.type}: ${g.target}`;
            ul.appendChild(li);
          });
          list.appendChild(ul);
        }
      } else {
        list.textContent = data.error || 'Error loading goals.';
      }
    } catch (err) {
      list.textContent = 'Network error.';
    }
  }

  // Submit workout
  document.getElementById('submitWorkout').addEventListener('click', async () => {
    const name = document.getElementById('workoutName').value.trim();
    const dateVal = document.getElementById('workoutDate').value;
    const duration = parseInt(document.getElementById('workoutDuration').value, 10);
    const messageEl = document.getElementById('workoutMessage');
    messageEl.textContent = '';
    if (!name || !dateVal || !duration) {
      messageEl.textContent = 'Please fill in all fields.';
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/workouts`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name, date: dateVal, duration })
      });
      const data = await res.json();
      if (res.ok) {
        // clear fields
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
    const dateVal = document.getElementById('mealDate').value;
    const calories = parseInt(document.getElementById('mealCalories').value, 10);
    const messageEl = document.getElementById('mealMessage');
    messageEl.textContent = '';
    if (!name || !dateVal || !calories) {
      messageEl.textContent = 'Please fill in all fields.';
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/meals`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name, date: dateVal, calories })
      });
      const data = await res.json();
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
      const data = await res.json();
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

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('fitness_token');
    window.location.href = 'login.html';
  });

  // Load all existing data
  loadData();
});