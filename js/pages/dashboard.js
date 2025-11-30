/*
  DASHBOARD PAGE LOGIC
  Purpose: Load and display dashboard data (stats, today's schedule, user info)
  Dependencies: utils.js, storage.js, auth.js
*/

// ============================================
// PAGE INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Dashboard loading...');
    
    // Initialize dashboard
    initializeDashboard();
    
    // Set up mobile navigation
    setupMobileNav();
    
    console.log('✅ Dashboard loaded');
});

// ============================================
// DASHBOARD INITIALIZATION
// ============================================

/**
 * Initialize the dashboard with all data
 */
function initializeDashboard() {
    // Load user data
    displayUserName();
    displayCurrentDate();
    displayMotivationalQuote();
    
    // Load stats
    displayUserStats();
    
    // Load today's schedule
    displayTodaysMeals();
    displayTodaysStudy();
    displayTodaysCleaning();
    
    // Check and update streak
    checkDailyLogin();
}

// ============================================
// WELCOME SECTION
// ============================================

/**
 * Display user's name in welcome message
 */
function displayUserName() {
    const user = getCurrentUser();
    const nameElement = $('#user-name');
    
    if (nameElement) {
        nameElement.textContent = user ? user.name : 'Student';
    }
}

/**
 * Display current date in friendly format
 */
function displayCurrentDate() {
    const dateElement = $('#current-date');
    
    if (dateElement) {
        const today = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        dateElement.textContent = today.toLocaleDateString('en-GB', options);
    }
}

/**
 * Display random motivational quote
 */
function displayMotivationalQuote() {
    const quoteElement = $('#motivational-quote');
    
    if (quoteElement) {
        const quotes = [
            "Every accomplishment starts with the decision to try.",
            "Success is the sum of small efforts repeated day in and day out.",
            "Your only limit is you.",
            "Dream big, start small, act now.",
            "Progress, not perfection.",
            "You've got this! 💪",
            "Small steps lead to big changes.",
            "Believe in yourself and all that you are.",
            "Make today amazing!",
            "You're capable of more than you know."
        ];
        
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteElement.textContent = `"${randomQuote}"`;
    }
}

// ============================================
// STATS DISPLAY
// ============================================

/**
 * Display user statistics (points, level, streak, tasks)
 */
function displayUserStats() {
    // Get user data from storage
    const userData = loadFromStorage('user_data') || {
        points: 0,
        level: 1,
        streak: 0
    };
    
    // Display points
    const pointsElement = $('#user-points');
    if (pointsElement) {
        pointsElement.textContent = userData.points || 0;
    }
    
    // Display level
    const levelElement = $('#user-level');
    if (levelElement) {
        levelElement.textContent = userData.level || 1;
    }
    
    // Display streak
    const streakElement = $('#user-streak');
    if (streakElement) {
        streakElement.textContent = userData.streak || 0;
    }
    
    // Display tasks completed today
    displayTasksCompleted();
}

/**
 * Calculate and display tasks completed today
 */
function displayTasksCompleted() {
    const todaysTasks = loadFromStorage('todays_tasks') || [];
    
    const completed = todaysTasks.filter(task => task.completed).length;
    const total = todaysTasks.length;
    
    const completedElement = $('#completed-tasks');
    const totalElement = $('#total-tasks');
    
    if (completedElement) completedElement.textContent = completed;
    if (totalElement) totalElement.textContent = total;
}

// ============================================
// TODAY'S SCHEDULE
// ============================================

/**
 * Display today's meals
 */
function displayTodaysMeals() {
    const container = $('#today-meals');
    if (!container) return;
    
    // Load meal planner data
    const mealPlan = loadFromStorage('meal_planner') || {};
    const today = formatDate(new Date(), 'yyyy-mm-dd');
    const todaysMeals = mealPlan[today] || [];
    
    if (todaysMeals.length === 0) {
        container.innerHTML = '<p class="empty-state">No meals planned yet. <a href="meals.html">Browse meals</a></p>';
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Render each meal
    todaysMeals.forEach(meal => {
        const mealItem = createElement('div', {
            class: 'today-item',
            style: 'border-left-color: var(--color-meals);'
        });
        
        mealItem.innerHTML = `
            <div class="today-item-content">
                <div class="today-item-title">${meal.name}</div>
                <div class="today-item-time">${meal.type} • ${meal.time || '30'} mins</div>
            </div>
            <div class="today-item-action">
                <button class="btn btn-sm btn-primary" style="background-color: var(--color-meals);">View</button>
            </div>
        `;
        
        container.appendChild(mealItem);
    });
}

/**
 * Display today's study sessions
 */
function displayTodaysStudy() {
    const container = $('#today-study');
    if (!container) return;
    
    // Load study timetable
    const timetable = loadFromStorage('study_timetable') || {};
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaysSessions = timetable[today] || [];
    
    if (todaysSessions.length === 0) {
        container.innerHTML = '<p class="empty-state">No study sessions planned. <a href="study.html">Create schedule</a></p>';
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Render each session
    todaysSessions.forEach(session => {
        const sessionItem = createElement('div', {
            class: 'today-item',
            style: 'border-left-color: var(--color-study);'
        });
        
        sessionItem.innerHTML = `
            <div class="today-item-content">
                <div class="today-item-title">${session.subject}</div>
                <div class="today-item-time">${session.startTime} - ${session.endTime} • ${session.type}</div>
            </div>
            <div class="today-item-action">
                <button class="btn btn-sm btn-primary" style="background-color: var(--color-study);">Start</button>
            </div>
        `;
        
        container.appendChild(sessionItem);
    });
}

/**
 * Display today's cleaning tasks
 */
function displayTodaysCleaning() {
    const container = $('#today-cleaning');
    if (!container) return;
    
    // Load cleaning schedule
    const schedule = loadFromStorage('cleaning_schedule') || {};
    const today = formatDate(new Date(), 'yyyy-mm-dd');
    const todaysTasks = schedule[today] || [];
    
    if (todaysTasks.length === 0) {
        container.innerHTML = '<p class="empty-state">No tasks scheduled. <a href="cleaning.html">View tasks</a></p>';
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Render each task
    todaysTasks.forEach(task => {
        const taskItem = createElement('div', {
            class: 'today-item',
            style: 'border-left-color: var(--color-cleaning);'
        });
        
        taskItem.innerHTML = `
            <div class="today-item-content">
                <div class="today-item-title">${task.name}</div>
                <div class="today-item-time">${task.room} • ${task.time || '15'} mins</div>
            </div>
            <div class="today-item-action">
                <button class="btn btn-sm btn-primary" style="background-color: var(--color-cleaning);" onclick="completeTask('${task.id}')">
                    Complete
                </button>
            </div>
        `;
        
        container.appendChild(taskItem);
    });
}

// ============================================
// STREAK TRACKING
// ============================================

/**
 * Check if user logged in today and update streak
 */
function checkDailyLogin() {
    const userData = loadFromStorage('user_data') || {
        lastLogin: null,
        streak: 0
    };
    
    const today = formatDate(new Date(), 'yyyy-mm-dd');
    const lastLogin = userData.lastLogin;
    
    // If first login or not logged in today
    if (!lastLogin || lastLogin !== today) {
        // Check if yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = formatDate(yesterday, 'yyyy-mm-dd');
        
        if (lastLogin === yesterdayStr) {
            // Increment streak
            userData.streak = (userData.streak || 0) + 1;
        } else if (!lastLogin) {
            // First login
            userData.streak = 1;
        } else {
            // Streak broken
            userData.streak = 1;
        }
        
        // Update last login
        userData.lastLogin = today;
        
        // Save
        saveToStorage('user_data', userData);
        
        // Update display
        displayUserStats();
    }
}

// ============================================
// MOBILE NAVIGATION
// ============================================

/**
 * Set up mobile navigation toggle
 */
function setupMobileNav() {
    const navToggle = $('.nav-toggle');
    const navMenu = $('#main-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
    }
}

console.log('✅ Dashboard script loaded');