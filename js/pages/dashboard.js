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
    
    console.log('✅ Dashboard loaded');
});

// ============================================
// DASHBOARD INITIALIZATION
// ============================================

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

function displayUserName() {
    const user = getCurrentUser();
    const nameElement = document.getElementById('user-name');
    
    if (nameElement) {
        nameElement.textContent = user ? user.name : 'Student';
    }
}

function displayCurrentDate() {
    const dateElement = document.getElementById('current-date');
    
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

function displayMotivationalQuote() {
    const quoteElement = document.getElementById('motivational-quote');
    
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
        quoteElement.textContent = '"' + randomQuote + '"';
    }
}

// ============================================
// STATS DISPLAY
// ============================================

function displayUserStats() {
    // Get user data from storage
    const userData = loadFromStorage('user_data') || {
        points: 0,
        level: 1,
        streak: 0
    };
    
    // Display points
    const pointsElement = document.getElementById('user-points');
    if (pointsElement) {
        pointsElement.textContent = userData.points || 0;
    }
    
    // Display points in header
    const headerPointsElement = document.getElementById('header-points');
    if (headerPointsElement) {
        headerPointsElement.textContent = userData.points || 0;
    }
    
    // Display level
    const levelElement = document.getElementById('user-level');
    if (levelElement) {
        levelElement.textContent = userData.level || 1;
    }
    
    // Display streak
    const streakElement = document.getElementById('user-streak');
    if (streakElement) {
        streakElement.textContent = userData.streak || 0;
    }
    
    // Display streak in header
    const headerStreakElement = document.getElementById('header-streak');
    if (headerStreakElement) {
        headerStreakElement.textContent = userData.streak || 0;
    }
    
    // Display tasks completed today
    displayTasksCompleted();
}

function displayTasksCompleted() {
    const todaysTasks = loadFromStorage('todays_tasks') || [];
    
    const completed = todaysTasks.filter(task => task.completed).length;
    const total = todaysTasks.length;
    
    const completedElement = document.getElementById('completed-tasks');
    const totalElement = document.getElementById('total-tasks');
    
    if (completedElement) completedElement.textContent = completed;
    if (totalElement) totalElement.textContent = total;
}

// ============================================
// TODAY'S SCHEDULE
// ============================================

function displayTodaysMeals() {
    const container = document.getElementById('today-meals');
    if (!container) return;
    
    // For now, show empty state
    container.innerHTML = '<p class="empty-state">No meals planned yet. <a href="meals.html">Browse meals</a></p>';
}

function displayTodaysStudy() {
    const container = document.getElementById('today-study');
    if (!container) return;
    
    // For now, show empty state
    container.innerHTML = '<p class="empty-state">No study sessions planned. <a href="study.html">Create schedule</a></p>';
}

function displayTodaysCleaning() {
    const container = document.getElementById('today-cleaning');
    if (!container) return;
    
    // For now, show empty state
    container.innerHTML = '<p class="empty-state">No tasks scheduled. <a href="cleaning.html">View tasks</a></p>';
}

// ============================================
// STREAK TRACKING
// ============================================

function checkDailyLogin() {
    const userData = loadFromStorage('user_data') || {
        lastLogin: null,
        streak: 0
    };
    
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = userData.lastLogin;
    
    // If first login or not logged in today
    if (!lastLogin || lastLogin !== today) {
        // Check if yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
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

console.log('✅ Dashboard script loaded');