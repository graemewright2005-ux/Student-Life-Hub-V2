/*
  MEALS PAGE LOGIC
  Load meals, handle filtering, render cards
*/

// ============================================
// STATE MANAGEMENT
// ============================================

let allMeals = [];
let currentFilters = {
    type: 'all',
    dietary: 'all',
    difficulty: 'all'
};

// ============================================
// PAGE INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🍳 Meals page loading...');
    
    // Load meals
    loadMeals();
    
    // Set up filter buttons
    setupFilters();
    
    console.log('✅ Meals page loaded');
});

// ============================================
// LOAD MEALS DATA
// ============================================

async function loadMeals() {
    try {
        // Load free meals
        const freeMeals = await loadFreeMeals();
        
        // Load premium meals (if user has premium)
        const user = getCurrentUser();
        const isPremium = user && user.isPremium;
        
        let premiumMeals = [];
        if (isPremium) {
            premiumMeals = await loadPremiumMeals();
        }
        
        // Combine all meals
        allMeals = [...freeMeals, ...premiumMeals];
        
        // Render meals
        renderMeals();
        
    } catch (error) {
        console.error('Error loading meals:', error);
        showError();
    }
}

async function loadFreeMeals() {
    const meals = [];
    
    try {
        // Load sample meal
        const response1 = await fetch('../data/meals/free/sample-meal.json');
        if (response1.ok) {
            const meal1 = await response1.json();
            meals.push(meal1);
        }
        
        // Load veggie stir fry
        const response2 = await fetch('../data/meals/free/veggie-stir-fry.json');
        if (response2.ok) {
            const meal2 = await response2.json();
            meals.push(meal2);
        }
    } catch (error) {
        console.error('Error loading free meals:', error);
    }
    
    return meals;
}

async function loadPremiumMeals() {
    const meals = [];
    
    try {
        const response = await fetch('../data/meals/premium/sample-premium.json');
        if (response.ok) {
            const meal = await response.json();
            meals.push(meal);
        }
    } catch (error) {
        console.error('Error loading premium meals:', error);
    }
    
    return meals;
}

// ============================================
// FILTER SETUP
// ============================================

function setupFilters() {
    // Meal type filters
    const typeButtons = document.querySelectorAll('[data-filter]');
    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active from siblings
            this.parentElement.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active to clicked button
            this.classList.add('active');
            
            // Update filter
            currentFilters.type = this.getAttribute('data-filter');
            renderMeals();
        });
    });
    
    // Dietary filters
    const dietaryButtons = document.querySelectorAll('[data-dietary]');
    dietaryButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            currentFilters.dietary = this.getAttribute('data-dietary');
            renderMeals();
        });
    });
    
    // Difficulty filters
    const difficultyButtons = document.querySelectorAll('[data-difficulty]');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            currentFilters.difficulty = this.getAttribute('data-difficulty');
            renderMeals();
        });
    });
}

// ============================================
// RENDER MEALS
// ============================================

function renderMeals() {
    const grid = document.getElementById('meals-grid');
    const emptyState = document.getElementById('empty-state');
    const resultsCount = document.getElementById('results-count');
    const premiumCount = document.getElementById('premium-count');
    
    // Filter meals
    const filteredMeals = filterMeals(allMeals);
    
    // Update counts
    resultsCount.textContent = filteredMeals.length;
    const premiumMealsCount = filteredMeals.filter(m => m.tier === 'premium').length;
    premiumCount.textContent = premiumMealsCount;
    
    // Clear grid
    grid.innerHTML = '';
    
    // Show empty state if no meals
    if (filteredMeals.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }
    
    // Render each meal card
    filteredMeals.forEach(meal => {
        const card = renderMealCard(meal);
        grid.appendChild(card);
    });
}

function filterMeals(meals) {
    return meals.filter(meal => {
        // Filter by type
        if (currentFilters.type !== 'all' && meal.type !== currentFilters.type) {
            return false;
        }
        
        // Filter by dietary
        if (currentFilters.dietary !== 'all') {
            if (!meal.dietary || !meal.dietary.includes(currentFilters.dietary)) {
                return false;
            }
        }
        
        // Filter by difficulty
        if (currentFilters.difficulty !== 'all' && meal.difficulty !== currentFilters.difficulty) {
            return false;
        }
        
        return true;
    });
}

// ============================================
// ERROR HANDLING
// ============================================

function showError() {
    const grid = document.getElementById('meals-grid');
    grid.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p>We couldn't load the meals. Please try refreshing the page.</p>
            <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
        </div>
    `;
}

console.log('✅ Meals script loaded');
