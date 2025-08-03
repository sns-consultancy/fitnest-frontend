/*
 * Client-side JavaScript for the fitness app using localStorage.
 */

const USERS_KEY = 'fitness_users';
const CURRENT_USER_KEY = 'fitness_current_user';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  return localStorage.getItem(CURRENT_USER_KEY);
}

function setCurrentUser(username) {
  localStorage.setItem(CURRENT_USER_KEY, username);
}

function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Signup logic
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('signupMessage');
    messageEl.textContent = '';
    const users = getUsers();
    if (users.find((u) => u.username === username)) {
      messageEl.style.color = '#d62828';
      messageEl.textContent = 'Username already exists.';
      return;
    }
    users.push({ username, password });
    saveUsers(users);
    signupForm.reset();
    messageEl.style.color = '#2a9d8f';
    messageEl.textContent = 'Account created! You can now log in.';
  });
}

// Login logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('loginMessage');
    messageEl.textContent = '';
    const user = getUsers().find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setCurrentUser(username);
      window.location.href = 'dashboard.html';
    } else {
      messageEl.style.color = '#d62828';
      messageEl.textContent = 'Invalid credentials.';
    }
  });
}

// Dashboard logic
const workoutsBtn = document.getElementById('workoutsBtn');
const mealsBtn = document.getElementById('mealsBtn');
const goalsBtn = document.getElementById('goalsBtn');

if (workoutsBtn && mealsBtn && goalsBtn) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = 'login.html';
  }

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
  showSection(workoutSection);

  const dataKey = (type) => `fitness_${type}_${currentUser}`;
  const getData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
  const saveData = (key, data) =>
    localStorage.setItem(key, JSON.stringify(data));

  function loadWorkouts() {
    const listEl = document.getElementById('workoutsList');
    const items = getData(dataKey('workouts'));
    if (items.length === 0) {
      listEl.textContent = 'No workouts logged yet.';
      return;
    }
    listEl.innerHTML = '';
    const ul = document.createElement('ul');
    items.forEach((w) => {
      const li = document.createElement('li');
      li.textContent = `${w.name} – ${w.date} – ${w.duration} min`;
      ul.appendChild(li);
    });
    listEl.appendChild(ul);
  }

  function loadMeals() {
    const listEl = document.getElementById('mealsList');
    const items = getData(dataKey('meals'));
    if (items.length === 0) {
      listEl.textContent = 'No meals logged yet.';
      return;
    }
    listEl.innerHTML = '';
    const ul = document.createElement('ul');
    items.forEach((m) => {
      const li = document.createElement('li');
      li.textContent = `${m.name} – ${m.date} – ${m.calories} cal`;
      ul.appendChild(li);
    });
    listEl.appendChild(ul);
  }

  function loadGoals() {
    const listEl = document.getElementById('goalsList');
    const items = getData(dataKey('goals'));
    if (items.length === 0) {
      listEl.textContent = 'No goals set yet.';
      return;
    }
    listEl.innerHTML = '';
    const ul = document.createElement('ul');
    items.forEach((g) => {
      const li = document.createElement('li');
      li.textContent = `${g.type}: ${g.target}`;
      ul.appendChild(li);
    });
    listEl.appendChild(ul);
  }

  document.getElementById('submitWorkout').addEventListener('click', () => {
    const name = document.getElementById('workoutName').value.trim();
    const date = document.getElementById('workoutDate').value;
    const duration = parseInt(
      document.getElementById('workoutDuration').value,
      10
    );
    const messageEl = document.getElementById('workoutMessage');
    messageEl.textContent = '';
    if (!name || !date || !duration) {
      messageEl.textContent = 'Please fill in all fields.';
      return;
    }
    const items = getData(dataKey('workouts'));
    items.push({ name, date, duration });
    saveData(dataKey('workouts'), items);
    document.getElementById('workoutName').value = '';
    document.getElementById('workoutDate').value = '';
    document.getElementById('workoutDuration').value = '';
    messageEl.style.color = '#2a9d8f';
    messageEl.textContent = 'Workout added!';
    loadWorkouts();
  });

  document.getElementById('submitMeal').addEventListener('click', () => {
    const name = document.getElementById('mealName').value.trim();
    const date = document.getElementById('mealDate').value;
    const calories = parseInt(
      document.getElementById('mealCalories').value,
      10
    );
    const messageEl = document.getElementById('mealMessage');
    messageEl.textContent = '';
    if (!name || !date || !calories) {
      messageEl.textContent = 'Please fill in all fields.';
      return;
    }
    const items = getData(dataKey('meals'));
    items.push({ name, date, calories });
    saveData(dataKey('meals'), items);
    document.getElementById('mealName').value = '';
    document.getElementById('mealDate').value = '';
    document.getElementById('mealCalories').value = '';
    messageEl.style.color = '#2a9d8f';
    messageEl.textContent = 'Meal added!';
    loadMeals();
  });

  document.getElementById('submitGoal').addEventListener('click', () => {
    const type = document.getElementById('goalType').value.trim();
    const target = document.getElementById('goalTarget').value.trim();
    const messageEl = document.getElementById('goalMessage');
    messageEl.textContent = '';
    if (!type || !target) {
      messageEl.textContent = 'Please fill in all fields.';
      return;
    }
    const items = getData(dataKey('goals'));
    items.push({ type, target });
    saveData(dataKey('goals'), items);
    document.getElementById('goalType').value = '';
    document.getElementById('goalTarget').value = '';
    messageEl.style.color = '#2a9d8f';
    messageEl.textContent = 'Goal set!';
    loadGoals();
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    logoutUser();
    window.location.href = 'login.html';
  });

  loadWorkouts();
  loadMeals();
  loadGoals();
}

