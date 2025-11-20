/*
  CARD RENDERING SYSTEM
  Purpose: Convert JSON data into beautiful flip cards
  Handles: Meal cards, task cards, study cards, support cards
*/

// ============================================
// RENDER MEAL CARD
// ============================================

/**
 * Create a meal card from data
 * @param {object} mealData - Meal data from JSON
 * @returns {HTMLElement} - Card element
 */
function renderMealCard(mealData) {
    // Create card container
    const card = createElement('div', {
        class: 'card meal-card',
        'data-card-id': mealData.id,
        'data-card-type': 'meal'
    });
    
    // Create flip container
    const flipContainer = createElement('div', { class: 'card-flip-container' });
    const flipInner = createElement('div', { class: 'card-flip-inner' });
    
    // Create FRONT of card
    const cardFront = createElement('div', { class: 'card-front' });
    
    // Header with category
    const header = createElement('div', { 
        class: 'card-header meals' 
    }, mealData.category);
    
    // Premium badge if premium
    if (mealData.isPremium) {
        const premiumBadge = createElement('span', {
            class: 'card-premium-badge'
        }, 'Premium');
        card.appendChild(premiumBadge);
    }
    
    // Card body
    const body = createElement('div', { class: 'card-body' });
    
    // Title
    const title = createElement('h3', { class: 'card-title' }, mealData.name);
    
    // Meta information (time, calories, cost)
    const meta = createElement('div', { class: 'card-meta' });
    meta.innerHTML = `
        <span class="card-meta-item">
            <span class="card-meta-icon">⏱️</span>
            <span>${mealData.time}m</span>
        </span>
        <span class="card-meta-item">
            <span class="card-meta-icon">🔥</span>
            <span>${mealData.calories} cal</span>
        </span>
        <span class="card-meta-item card-cost">
            <span class="card-meta-icon card-cost-icon">£</span>
            <span>${mealData.cost.toFixed(2)}</span>
        </span>
    `;
    
    // Tags
    const tags = createElement('div', { class: 'card-tags' });
    mealData.dietary.forEach(diet => {
        const tag = createElement('span', { 
            class: `card-tag ${diet}` 
        }, capitalize(diet));
        tags.appendChild(tag);
    });
    
    const difficultyTag = createElement('span', {
        class: `card-tag ${mealData.difficulty}`
    }, capitalize(mealData.difficulty));
    tags.appendChild(difficultyTag);
    
    // Rating
    const rating = createElement('div', { class: 'card-rating' });
    const stars = createElement('div', { class: 'card-stars' });
    
    for (let i = 1; i <= 5; i++) {
        const star = createElement('span', {
            class: i <= Math.floor(mealData.rating) ? 'card-star' : 'card-star empty'
        }, '⭐');
        stars.appendChild(star);
    }
    
    const ratingCount = createElement('span', {
        class: 'card-rating-count'
    }, `(${mealData.ratingCount})`);
    
    rating.appendChild(stars);
    rating.appendChild(ratingCount);
    
    // Assemble front
    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(tags);
    body.appendChild(rating);
    
    const flipHint = createElement('span', {
        class: 'card-flip-hint'
    }, '↻ Click to view recipe');
    body.appendChild(flipHint);
    
    cardFront.appendChild(header);
    cardFront.appendChild(body);
    
    // Create BACK of card
    const cardBack = createElement('div', { class: 'card-back' });
    
    const backHeader = createElement('div', { 
        class: 'card-header meals' 
    }, mealData.category);
    
    const backBody = createElement('div', { class: 'card-body' });
    
    // Title on back
    const backTitle = createElement('h3', { class: 'card-title' }, mealData.name);
    backBody.appendChild(backTitle);
    
    // Ingredients section
    const ingredientsSection = createElement('div', { class: 'card-section' });
    const ingredientsTitle = createElement('h4', {
        class: 'card-section-title'
    });
    ingredientsTitle.innerHTML = '<span class="card-section-icon">🥘</span> Ingredients';
    
    const ingredientsList = createElement('ul', { class: 'card-list' });
    mealData.ingredients.forEach(ingredient => {
        const item = createElement('li', {
            class: 'card-list-item'
        }, `${ingredient.amount} ${ingredient.name}`);
        ingredientsList.appendChild(item);
    });
    
    ingredientsSection.appendChild(ingredientsTitle);
    ingredientsSection.appendChild(ingredientsList);
    backBody.appendChild(ingredientsSection);
    
    // Instructions section
    const instructionsSection = createElement('div', { class: 'card-section' });
    const instructionsTitle = createElement('h4', {
        class: 'card-section-title'
    });
    instructionsTitle.innerHTML = '<span class="card-section-icon">📝</span> Instructions';
    
    const instructionsList = createElement('ol', { class: 'card-list card-list-numbered' });
    mealData.instructions.forEach(instruction => {
        const item = createElement('li', {
            class: 'card-list-item'
        }, instruction);
        instructionsList.appendChild(item);
    });
    
    instructionsSection.appendChild(instructionsTitle);
    instructionsSection.appendChild(instructionsList);
    backBody.appendChild(instructionsSection);
    
    // Footer with actions
    const footer = createElement('div', { class: 'card-footer' });
    footer.innerHTML = `
        <button class="btn btn-secondary btn-sm" onclick="flipCard(this)">
            ← Back
        </button>
        <button class="btn btn-primary btn-sm" onclick="addToPlanner('${mealData.id}')">
            Add to Planner
        </button>
    `;
    
    cardBack.appendChild(backHeader);
    cardBack.appendChild(backBody);
    cardBack.appendChild(footer);
    
    // Assemble everything
    flipInner.appendChild(cardFront);
    flipInner.appendChild(cardBack);
    flipContainer.appendChild(flipInner);
    card.appendChild(flipContainer);
    
    // Add click to flip
    card.addEventListener('click', function(e) {
        // Don't flip if clicking buttons
        if (e.target.tagName === 'BUTTON') return;
        toggleCardFlip(card);
    });
    
    return card;
}

// ============================================
// RENDER TASK CARD (Study/Cleaning/DIY)
// ============================================

/**
 * Create a task card from data
 * @param {object} taskData - Task data from JSON
 * @returns {HTMLElement} - Card element
 */
function renderTaskCard(taskData) {
    const card = createElement('div', {
        class: 'card task-card',
        'data-card-id': taskData.id,
        'data-card-type': taskData.type
    });
    
    const flipContainer = createElement('div', { class: 'card-flip-container' });
    const flipInner = createElement('div', { class: 'card-flip-inner' });
    
    // FRONT of card
    const cardFront = createElement('div', { class: 'card-front' });
    
    // Determine header color based on type
    let headerClass = 'card-header';
    if (taskData.type === 'study') headerClass += ' study';
    if (taskData.type === 'cleaning') headerClass += ' cleaning';
    if (taskData.type === 'diy') headerClass += ' diy';
    
    const header = createElement('div', { class: headerClass }, taskData.category);
    
    // Premium badge
    if (taskData.isPremium) {
        const premiumBadge = createElement('span', {
            class: 'card-premium-badge'
        }, 'Premium');
        card.appendChild(premiumBadge);
    }
    
    const body = createElement('div', { class: 'card-body' });
    
    const title = createElement('h3', { class: 'card-title' }, taskData.name);
    
    // Meta info
    const meta = createElement('div', { class: 'card-meta' });
    meta.innerHTML = `
        <span class="card-meta-item">
            <span class="card-meta-icon">⏱️</span>
            <span>${taskData.time}m</span>
        </span>
        <span class="card-meta-item">
            <span class="card-meta-icon">⭐</span>
            <span>${taskData.points} points</span>
        </span>
    `;
    
    // Difficulty tag
    const difficultyTag = createElement('span', {
        class: `card-tag ${taskData.difficulty}`
    }, capitalize(taskData.difficulty));
    
    // Description
    const description = createElement('p', {}, taskData.description || taskData.motivation);
    
    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(difficultyTag);
    body.appendChild(description);
    
    const flipHint = createElement('span', {
        class: 'card-flip-hint'
    }, '↻ Click for instructions');
    body.appendChild(flipHint);
    
    cardFront.appendChild(header);
    cardFront.appendChild(body);
    
    // BACK of card
    const cardBack = createElement('div', { class: 'card-back' });
    
    const backHeader = createElement('div', { class: headerClass }, taskData.category);
    const backBody = createElement('div', { class: 'card-body' });
    
    const backTitle = createElement('h3', { class: 'card-title' }, taskData.name);
    backBody.appendChild(backTitle);
    
    // Instructions
    const instructionsSection = createElement('div', { class: 'card-section' });
    const instructionsTitle = createElement('h4', {
        class: 'card-section-title'
    });
    instructionsTitle.innerHTML = '<span class="card-section-icon">📝</span> Instructions';
    
    const instructionsList = createElement('ol', { class: 'card-list card-list-numbered' });
    taskData.instructions.forEach(instruction => {
        const item = createElement('li', {
            class: 'card-list-item'
        }, instruction);
        instructionsList.appendChild(item);
    });
    
    instructionsSection.appendChild(instructionsTitle);
    instructionsSection.appendChild(instructionsList);
    backBody.appendChild(instructionsSection);
    
    // Tips if available
    if (taskData.tips && taskData.tips.length > 0) {
        const tipsSection = createElement('div', { class: 'card-section' });
        const tipsTitle = createElement('h4', {
            class: 'card-section-title'
        });
        tipsTitle.innerHTML = '<span class="card-section-icon">💡</span> Tips';
        
        const tipsList = createElement('ul', { class: 'card-list' });
        taskData.tips.forEach(tip => {
            const item = createElement('li', {
                class: 'card-list-item'
            }, tip);
            tipsList.appendChild(item);
        });
        
        tipsSection.appendChild(tipsTitle);
        tipsSection.appendChild(tipsList);
        backBody.appendChild(tipsSection);
    }
    
    // Footer
    const footer = createElement('div', { class: 'card-footer' });
    footer.innerHTML = `
        <button class="btn btn-secondary btn-sm" onclick="flipCard(this)">
            ← Back
        </button>
        <button class="btn btn-success btn-sm" onclick="completeTask('${taskData.id}')">
            ✓ Complete
        </button>
    `;
    
    cardBack.appendChild(backHeader);
    cardBack.appendChild(backBody);
    cardBack.appendChild(footer);
    
    // Assemble
    flipInner.appendChild(cardFront);
    flipInner.appendChild(cardBack);
    flipContainer.appendChild(flipInner);
    card.appendChild(flipContainer);
    
    // Add click to flip
    card.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') return;
        toggleCardFlip(card);
    });
    
    return card;
}

// ============================================
// CARD FLIP FUNCTIONS
// ============================================

/**
 * Toggle card flip state
 * @param {HTMLElement} card - Card element
 */
function toggleCardFlip(card) {
    card.classList.toggle('flipped');
    
    // Announce to screen readers
    const isFlipped = card.classList.contains('flipped');
    const announcement = isFlipped ? 'Card flipped to show details' : 'Card flipped to front';
    announceToScreenReader(announcement);
}

/**
 * Flip card from button click
 * @param {HTMLElement} button - Button that was clicked
 */
function flipCard(button) {
    const card = button.closest('.card');
    if (card) {
        toggleCardFlip(card);
    }
}

// ============================================
// PLACEHOLDER FUNCTIONS (TO BE IMPLEMENTED)
// ============================================

/**
 * Add meal to planner (placeholder)
 * @param {string} mealId - Meal ID
 */
function addToPlanner(mealId) {
    console.log('Adding to planner:', mealId);
    // TODO: Implement in Theme 2 (Meals section)
    alert('Adding to planner: ' + mealId + '\n(This will be implemented in the Meals section)');
}

/**
 * Complete task and award points (placeholder)
 * @param {string} taskId - Task ID
 */
function completeTask(taskId) {
    console.log('Completing task:', taskId);
    // TODO: Implement in Theme 1.4 (Gamification)
    alert('Task completed: ' + taskId + '\n(Points will be awarded when gamification is implemented)');
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
    const announcement = createElement('div', {
        class: 'sr-only',
        role: 'status',
        'aria-live': 'polite'
    }, message);
    
    document.body.appendChild(announcement);
    
    // Remove after announced
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

console.log('✅ Card rendering system loaded');
