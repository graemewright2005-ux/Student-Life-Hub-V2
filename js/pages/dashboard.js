/**
 * Dashboard Page Functionality
 * Student Life Hub V2
 * Handles dashboard initialization, stats display, tasks, and AI suggestions
 */

// ============================================
// CONFIGURATION
// ============================================

const DASHBOARD_CONFIG = {
    pointsPerTask: 10,
    pointsPerStudySession: 15,
    pointsPerMeal: 20,
    pointsPerCleaningTask: 5,
    pointsPerLevel: 500,
    maxSuggestions: 6,
    taskRefreshInterval: 300000 // 5 minutes
};

// ============================================
// STATE MANAGEMENT
// ============================================

let dashboardState = {
    user: null,
    stats: {
        totalPoints: 0,
        level: 1,
        xpToday: 0,
        tasksCompleted: 0,
        streakDays: 0
    },
    tasks: [],
    suggestions: [],
    isPremium: false
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize dashboard when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    setupModalHandlers();
    
    // Refresh tasks periodically
    setInterval(loadTodaysTasks, DASHBOARD_CONFIG.taskRefreshInterval);
});

/**
 * Initialize dashboard data and UI
 */
function initializeDashboard() {
    try {
        // Load user data
        loadUserData();
        
        // Update welcome section
        updateWelcomeSection();
        
        // Load and display stats
        loadUserStats();
        updateStatsDisplay();
        
        // Load today's tasks
        loadTodaysTasks();
        
        // Load suggestions (if premium)
        if (dashboardState.isPremium) {
            loadSuggestions();
        } else {
            showPremiumUpsell();
        }
        
        console.log('Dashboard initialized successfully');
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showErrorMessage('Failed to load dashboard data');
    }
}

// ============================================
// USER DATA
// ============================================

/**
 * Load current user data
 */
function loadUserData() {
    // Get current user from auth system
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        dashboardState.user = currentUser;
        dashboardState.isPremium = isPremiumUser();
    } else {
        // Default user if not logged in
        dashboardState.user = {
            name: 'Student',
            email: null
        };
        dashboardState.isPremium = false;
    }
}

/**
 * Update welcome section with user name and date
 */
function updateWelcomeSection() {
    const userName = $('#user-name');
    const currentDate = $('#current-date');
    
    if (userName) {
        userName.textContent = dashboardState.user.name || 'Student';
    }
    
    if (currentDate) {
        currentDate.textContent = formatWelcomeDate();
    }
}

/**
 * Format date for welcome message
 * @returns {string} Formatted date string
 */
function formatWelcomeDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return now.toLocaleDateString('en-GB', options);
}

// ============================================
// STATISTICS
// ============================================

/**
 * Load user statistics from storage
 */
function loadUserStats() {
    const savedStats = loadFromStorage(STORAGE_KEYS.USER_STATS);
    
    if (savedStats) {
        dashboardState.stats = {
            ...dashboardState.stats,
            ...savedStats
        };
    } else {
        // Initialize default stats
        dashboardState.stats = {
            totalPoints: 0,
            level: 1,
            xpToday: 0,
            tasksCompleted: 0,
            streakDays: 0
        };
        saveToStorage(STORAGE_KEYS.USER_STATS, dashboardState.stats);
    }
    
    // Calculate current level
    dashboardState.stats.level = calculateLevel(dashboardState.stats.totalPoints);
    
    // Update streak
    updateStreak();
}

/**
 * Calculate user level based on total points
 * @param {number} points - Total points
 * @returns {number} User level
 */
function calculateLevel(points) {
    return Math.floor(points / DASHBOARD_CONFIG.pointsPerLevel) + 1;
}

/**
 * Update streak days
 */
function updateStreak() {
    const lastActiveDate = loadFromStorage(STORAGE_KEYS.LAST_ACTIVE);
    const today = new Date().toDateString();
    
    if (lastActiveDate) {
        const lastDate = new Date(lastActiveDate);
        const daysDiff = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
            // Same day, keep current streak
        } else if (daysDiff === 1) {
            // Consecutive day, increment streak
            dashboardState.stats.streakDays += 1;
        } else {
            // Streak broken
            dashboardState.stats.streakDays = 1;
        }
    } else {
        // First time
        dashboardState.stats.streakDays = 1;
    }
    
    // Save updated date
    saveToStorage(STORAGE_KEYS.LAST_ACTIVE, today);
    
    // Save stats
    saveToStorage(STORAGE_KEYS.USER_STATS, dashboardState.stats);
}

/**
 * Update statistics display in UI
 */
function updateStatsDisplay() {
    // Update total points
    const totalPoints = $('#total-points');
    if (totalPoints) {
        animateCounter(totalPoints, dashboardState.stats.totalPoints);
    }
    
    // Update level
    const userLevel = $('#user-level');
    if (userLevel) {
        animateCounter(userLevel, dashboardState.stats.level);
    }
    
    // Update XP today
    const xpToday = $('#xp-today');
    if (xpToday) {
        animateCounter(xpToday, dashboardState.stats.xpToday);
    }
    
    // Update tasks completed
    const tasksCompleted = $('#tasks-completed');
    if (tasksCompleted) {
        animateCounter(tasksCompleted, dashboardState.stats.tasksCompleted);
    }
    
    // Update streak
    const streakDays = $('#streak-days');
    if (streakDays) {
        animateCounter(streakDays, dashboardState.stats.streakDays);
    }
}

/**
 * Animate counter from 0 to target value
 * @param {HTMLElement} element - Element to animate
 * @param {number} target - Target number
 */
function animateCounter(element, target) {
    const duration = 1000; // 1 second
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ============================================
// TASKS MANAGEMENT
// ============================================

/**
 * Load today's tasks
 */
function loadTodaysTasks() {
    const allTasks = loadFromStorage(STORAGE_KEYS.USER_TASKS) || [];
    const today = new Date().toDateString();
    
    // Filter tasks for today
    dashboardState.tasks = allTasks.filter(task => {
        if (!task.date) return false;
        const taskDate = new Date(task.date).toDateString();
        return taskDate === today && !task.completed;
    });
    
    // Also load from JSON task templates
    loadTaskTemplates();
    
    // Render tasks
    renderTasks();
}

/**
 * Load task templates from JSON
 */
function loadTaskTemplates() {
    // Load study tasks
    fetch('../data/tasks/study-tasks.json')
        .then(response => response.json())
        .then(data => {
            // Add some default study tasks if user has none
            if (dashboardState.tasks.filter(t => t.category === 'study').length === 0) {
                const sampleTask = data.tasks && data.tasks[0];
                if (sampleTask) {
                    dashboardState.tasks.push({
                        id: generateId(),
                        ...sampleTask,
                        date: new Date().toISOString(),
                        completed: false
                    });
                }
            }
        })
        .catch(error => console.log('No study tasks template found'));
    
    // Load cleaning tasks
    fetch('../data/tasks/cleaning-tasks.json')
        .then(response => response.json())
        .then(data => {
            // Add some default cleaning tasks if user has none
            if (dashboardState.tasks.filter(t => t.category === 'cleaning').length === 0) {
                const sampleTask = data.tasks && data.tasks[0];
                if (sampleTask) {
                    dashboardState.tasks.push({
                        id: generateId(),
                        ...sampleTask,
                        date: new Date().toISOString(),
                        completed: false
                    });
                }
            }
        })
        .catch(error => console.log('No cleaning tasks template found'));
}

/**
 * Render tasks in the UI
 */
function renderTasks() {
    const tasksContainer = $('#tasks-container');
    const noTasksMessage = $('#no-tasks-message');
    
    if (!tasksContainer) return;
    
    if (dashboardState.tasks.length === 0) {
        tasksContainer.innerHTML = '';
        if (noTasksMessage) {
            noTasksMessage.hidden = false;
        }
        return;
    }
    
    if (noTasksMessage) {
        noTasksMessage.hidden = true;
    }
    
    tasksContainer.innerHTML = dashboardState.tasks.map(task => createTaskCard(task)).join('');
    
    // Attach event listeners to task buttons
    attachTaskEventListeners();
}

/**
 * Create HTML for a task card
 * @param {Object} task - Task object
 * @returns {string} HTML string
 */
function createTaskCard(task) {
    const categoryIcons = {
        study: '📚',
        meals: '🍳',
        cleaning: '🧹',
        budget: '💰',
        diy: '🔧',
        other: '📋'
    };
    
    const priorityClass = `task-priority-${task.priority || 'medium'}`;
    const categoryClass = `task-category-${task.category || 'other'}`;
    
    return `
        <article class="task-card" data-task-id="${task.id}">
            <div class="task-card-header">
                <div class="task-category-icon ${categoryClass}">
                    ${categoryIcons[task.category] || '📋'}
                </div>
                <span class="task-priority ${priorityClass}">
                    ${task.priority || 'medium'}
                </span>
            </div>
            <div class="task-card-body">
                <h3 class="task-title">${escapeHtml(task.title)}</h3>
                <div class="task-meta">
                    ${task.time ? `
                    <span class="task-meta-item">
                        <span aria-hidden="true">⏱️</span>
                        ${task.time} min
                    </span>
                    ` : ''}
                    <span class="task-meta-item">
                        <span aria-hidden="true">🎯</span>
                        ${DASHBOARD_CONFIG.pointsPerTask} XP
                    </span>
                </div>
                <div class="task-actions">
                    <button class="btn-primary btn-small complete-task-btn" 
                            data-task-id="${task.id}"
                            aria-label="Complete task: ${escapeHtml(task.title)}">
                        ✓ Complete
                    </button>
                    <button class="btn-secondary btn-small delete-task-btn" 
                            data-task-id="${task.id}"
                            aria-label="Delete task: ${escapeHtml(task.title)}">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </article>
    `;
}

/**
 * Attach event listeners to task action buttons
 */
function attachTaskEventListeners() {
    // Complete task buttons
    $$('.complete-task-btn').forEach(btn => {
        btn.addEventListener('click', handleCompleteTask);
    });
    
    // Delete task buttons
    $$('.delete-task-btn').forEach(btn => {
        btn.addEventListener('click', handleDeleteTask);
    });
}

/**
 * Handle task completion
 * @param {Event} event - Click event
 */
function handleCompleteTask(event) {
    const taskId = event.currentTarget.dataset.taskId;
    const task = dashboardState.tasks.find(t => t.id === taskId);
    
    if (!task) return;
    
    // Mark task as completed
    task.completed = true;
    task.completedAt = new Date().toISOString();
    
    // Award points
    const points = DASHBOARD_CONFIG.pointsPerTask;
    awardPoints(points);
    
    // Update task in storage
    const allTasks = loadFromStorage(STORAGE_KEYS.USER_TASKS) || [];
    const taskIndex = allTasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        allTasks[taskIndex] = task;
    } else {
        allTasks.push(task);
    }
    saveToStorage(STORAGE_KEYS.USER_TASKS, allTasks);
    
    // Update stats
    dashboardState.stats.tasksCompleted += 1;
    saveToStorage(STORAGE_KEYS.USER_STATS, dashboardState.stats);
    updateStatsDisplay();
    
    // Show celebration
    showTaskCompletionCelebration(task.title, points);
    
    // Remove from today's tasks
    dashboardState.tasks = dashboardState.tasks.filter(t => t.id !== taskId);
    renderTasks();
}

/**
 * Handle task deletion
 * @param {Event} event - Click event
 */
function handleDeleteTask(event) {
    const taskId = event.currentTarget.dataset.taskId;
    
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    // Remove from state
    dashboardState.tasks = dashboardState.tasks.filter(t => t.id !== taskId);
    
    // Remove from storage
    const allTasks = loadFromStorage(STORAGE_KEYS.USER_TASKS) || [];
    const updatedTasks = allTasks.filter(t => t.id !== taskId);
    saveToStorage(STORAGE_KEYS.USER_TASKS, updatedTasks);
    
    // Re-render
    renderTasks();
}

/**
 * Award points to user
 * @param {number} points - Points to award
 */
function awardPoints(points) {
    dashboardState.stats.totalPoints += points;
    dashboardState.stats.xpToday += points;
    
    // Check for level up
    const newLevel = calculateLevel(dashboardState.stats.totalPoints);
    if (newLevel > dashboardState.stats.level) {
        showLevelUpCelebration(newLevel);
        dashboardState.stats.level = newLevel;
    }
    
    saveToStorage(STORAGE_KEYS.USER_STATS, dashboardState.stats);
}

// ============================================
// AI SUGGESTIONS (PREMIUM)
// ============================================

/**
 * Show premium upsell for free users
 */
function showPremiumUpsell() {
    const upsell = $('#premium-upsell');
    const suggestions = $('#suggestions-container');
    
    if (upsell) {
        upsell.hidden = false;
    }
    if (suggestions) {
        suggestions.hidden = true;
    }
}

/**
 * Load AI suggestions for premium users
 */
function loadSuggestions() {
    const upsell = $('#premium-upsell');
    const suggestions = $('#suggestions-container');
    
    if (upsell) {
        upsell.hidden = true;
    }
    if (suggestions) {
        suggestions.hidden = false;
    }
    
    // Generate smart suggestions based on user patterns
    dashboardState.suggestions = generateSuggestions();
    
    // Render suggestions
    renderSuggestions();
}

/**
 * Generate smart task suggestions
 * @returns {Array} Array of suggestion objects
 */
function generateSuggestions() {
    const allTasks = loadFromStorage(STORAGE_KEYS.USER_TASKS) || [];
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    
    const suggestions = [];
    
    // Suggest study tasks on weekdays
    if (today >= 1 && today <= 5) {
        suggestions.push({
            id: generateId(),
            title: 'Review today\'s lecture notes',
            category: 'study',
            time: 30,
            priority: 'high',
            reason: 'You usually study in the afternoon on weekdays',
            icon: '📚'
        });
    }
    
    // Suggest meal prep on Sunday
    if (today === 0) {
        suggestions.push({
            id: generateId(),
            title: 'Meal prep for the week',
            category: 'meals',
            time: 90,
            priority: 'medium',
            reason: 'Sunday is your usual meal prep day',
            icon: '🍳'
        });
    }
    
    // Suggest cleaning on weekends
    if (today === 0 || today === 6) {
        suggestions.push({
            id: generateId(),
            title: 'Clean your room',
            category: 'cleaning',
            time: 45,
            priority: 'medium',
            reason: 'It\'s been a week since your last deep clean',
            icon: '🧹'
        });
    }
    
    // Suggest budget review at month start
    const dayOfMonth = new Date().getDate();
    if (dayOfMonth <= 5) {
        suggestions.push({
            id: generateId(),
            title: 'Review monthly budget',
            category: 'budget',
            time: 20,
            priority: 'high',
            reason: 'Start of the month is perfect for budget planning',
            icon: '💰'
        });
    }
    
    return suggestions.slice(0, DASHBOARD_CONFIG.maxSuggestions);
}

/**
 * Render suggestions in the UI
 */
function renderSuggestions() {
    const container = $('#suggestions-container');
    if (!container) return;
    
    if (dashboardState.suggestions.length === 0) {
        container.innerHTML = '<p class="empty-state">No suggestions available right now. Check back later!</p>';
        return;
    }
    
    container.innerHTML = dashboardState.suggestions.map(suggestion => createSuggestionCard(suggestion)).join('');
    
    // Attach event listeners
    attachSuggestionEventListeners();
}

/**
 * Create HTML for a suggestion card
 * @param {Object} suggestion - Suggestion object
 * @returns {string} HTML string
 */
function createSuggestionCard(suggestion) {
    return `
        <article class="suggestion-card" data-suggestion-id="${suggestion.id}">
            <div class="suggestion-header">
                <div class="suggestion-icon">${suggestion.icon}</div>
                <span class="suggestion-badge">AI</span>
            </div>
            <h3 class="suggestion-title">${escapeHtml(suggestion.title)}</h3>
            <p class="suggestion-reason">${escapeHtml(suggestion.reason)}</p>
            <div class="suggestion-actions">
                <button class="btn-primary btn-small add-suggestion-btn" 
                        data-suggestion-id="${suggestion.id}"
                        aria-label="Add suggested task: ${escapeHtml(suggestion.title)}">
                    ➕ Add Task
                </button>
                <button class="btn-secondary btn-small dismiss-suggestion-btn" 
                        data-suggestion-id="${suggestion.id}"
                        aria-label="Dismiss suggestion: ${escapeHtml(suggestion.title)}">
                    ✕ Dismiss
                </button>
            </div>
        </article>
    `;
}

/**
 * Attach event listeners to suggestion buttons
 */
function attachSuggestionEventListeners() {
    $$('.add-suggestion-btn').forEach(btn => {
        btn.addEventListener('click', handleAddSuggestion);
    });
    
    $$('.dismiss-suggestion-btn').forEach(btn => {
        btn.addEventListener('click', handleDismissSuggestion);
    });
}

/**
 * Handle adding a suggested task
 * @param {Event} event - Click event
 */
function handleAddSuggestion(event) {
    const suggestionId = event.currentTarget.dataset.suggestionId;
    const suggestion = dashboardState.suggestions.find(s => s.id === suggestionId);
    
    if (!suggestion) return;
    
    // Create task from suggestion
    const newTask = {
        id: generateId(),
        title: suggestion.title,
        category: suggestion.category,
        time: suggestion.time,
        priority: suggestion.priority,
        date: new Date().toISOString(),
        completed: false,
        fromSuggestion: true
    };
    
    // Add to tasks
    dashboardState.tasks.push(newTask);
    
    // Save to storage
    const allTasks = loadFromStorage(STORAGE_KEYS.USER_TASKS) || [];
    allTasks.push(newTask);
    saveToStorage(STORAGE_KEYS.USER_TASKS, allTasks);
    
    // Remove from suggestions
    dashboardState.suggestions = dashboardState.suggestions.filter(s => s.id !== suggestionId);
    
    // Re-render both sections
    renderTasks();
    renderSuggestions();
    
    // Show success message
    showSuccessMessage('Task added to your list!');
}

/**
 * Handle dismissing a suggestion
 * @param {Event} event - Click event
 */
function handleDismissSuggestion(event) {
    const suggestionId = event.currentTarget.dataset.suggestionId;
    
    // Remove from suggestions
    dashboardState.suggestions = dashboardState.suggestions.filter(s => s.id !== suggestionId);
    
    // Re-render
    renderSuggestions();
}

// ============================================
// MODAL HANDLERS
// ============================================

/**
 * Setup modal event handlers
 */
function setupModalHandlers() {
    const modal = $('#add-task-modal');
    const addTaskBtn = $('#add-task-btn');
    const addTaskForm = $('#add-task-form');
    const closeBtns = $$('[data-close-modal]');
    
    // Open modal
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            openModal(modal);
        });
    }
    
    // Close modal buttons
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(modal);
        });
    });
    
    // Submit form
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', handleAddTaskSubmit);
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) {
            closeModal(modal);
        }
    });
}

/**
 * Open modal
 * @param {HTMLElement} modal - Modal element
 */
function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    modal.querySelector('.form-input')?.focus();
    document.body.style.overflow = 'hidden';
}

/**
 * Close modal
 * @param {HTMLElement} modal - Modal element
 */
function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    
    // Reset form
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
    }
}

/**
 * Handle add task form submission
 * @param {Event} event - Submit event
 */
function handleAddTaskSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const newTask = {
        id: generateId(),
        title: formData.get('title'),
        category: formData.get('category'),
        time: parseInt(formData.get('time')) || null,
        priority: formData.get('priority'),
        date: new Date().toISOString(),
        completed: false
    };
    
    // Add to tasks
    dashboardState.tasks.push(newTask);
    
    // Save to storage
    const allTasks = loadFromStorage(STORAGE_KEYS.USER_TASKS) || [];
    allTasks.push(newTask);
    saveToStorage(STORAGE_KEYS.USER_TASKS, allTasks);
    
    // Re-render
    renderTasks();
    
    // Close modal
    const modal = $('#add-task-modal');
    closeModal(modal);
    
    // Show success
    showSuccessMessage('Task added successfully!');
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Setup general event listeners
 */
function setupEventListeners() {
    // Upgrade button
    const upgradeBtn = $('#upgrade-btn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', handleUpgradeClick);
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = $('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
}

/**
 * Handle upgrade button click
 */
function handleUpgradeClick() {
    alert('Premium upgrade feature coming soon!\n\nYou\'ll be able to:\n• Get AI-powered suggestions\n• Access 300+ meal recipes\n• Plan 4 weeks ahead\n• Export to PDF/CSV\n• Sync across devices\n\nStay tuned!');
}

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
    const nav = $('#main-nav');
    const toggle = $('.mobile-menu-toggle');
    
    if (!nav || !toggle) return;
    
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('open');
}

// ============================================
// NOTIFICATIONS & FEEDBACK
// ============================================

/**
 * Show success message
 * @param {string} message - Success message
 */
function showSuccessMessage(message) {
    const notification = createElement('div', {
        className: 'notification notification-success',
        textContent: message,
        role: 'status',
        'aria-live': 'polite'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showErrorMessage(message) {
    const notification = createElement('div', {
        className: 'notification notification-error',
        textContent: message,
        role: 'alert',
        'aria-live': 'assertive'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Show task completion celebration
 * @param {string} taskTitle - Title of completed task
 * @param {number} points - Points awarded
 */
function showTaskCompletionCelebration(taskTitle, points) {
    const celebration = createElement('div', {
        className: 'celebration-popup',
        innerHTML: `
            <div class="celebration-content">
                <div class="celebration-icon">🎉</div>
                <h3>Task Complete!</h3>
                <p>${escapeHtml(taskTitle)}</p>
                <div class="celebration-points">+${points} XP</div>
            </div>
        `
    });
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        celebration.classList.remove('show');
        setTimeout(() => celebration.remove(), 300);
    }, 2500);
}

/**
 * Show level up celebration
 * @param {number} newLevel - New level achieved
 */
function showLevelUpCelebration(newLevel) {
    const celebration = createElement('div', {
        className: 'celebration-popup level-up',
        innerHTML: `
            <div class="celebration-content">
                <div class="celebration-icon">🏆</div>
                <h3>Level Up!</h3>
                <p>You've reached Level ${newLevel}!</p>
                <div class="celebration-points">Keep crushing it! 🔥</div>
            </div>
        `
    });
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        celebration.classList.remove('show');
        setTimeout(() => celebration.remove(), 300);
    }, 3000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

console.log('Dashboard JS loaded successfully');
