# 🎓 Student Life Hub V2

**Modern, gamified student life management system - Your all-in-one wellbeing and lifestyle support app**

---

## 🌟 Overview

Student Life Hub is a comprehensive web application designed to support 18-25 year olds in living independently, particularly when starting university. It combines meal planning, study organization, cleaning schedules, budget tracking, and essential student resources in one accessible, mobile-first platform.

**Target Users:** HE and University Students  
**Business Model:** Freemium (Free tier + Premium subscription)  
**Launch Target:** February 2026

---

## 🎨 Design System

### Color Palette

Our design uses color psychology to create distinct, memorable sections:

| Section | Color | Hex | Purpose |
|---------|-------|-----|---------|
| **Study** | Blue | `#3B82F6` | Focus, intelligence, calm |
| **Meals** | Orange | `#F97316` | Appetite, warmth, energy |
| **Cleaning** | Green | `#10B981` | Freshness, cleanliness |
| **Budget** | Purple | `#8B5CF6` | Wealth, value, sophistication |
| **DIY** | Yellow | `#F59E0B` | Caution, tools, practical |
| **Support** | Teal | `#14B8A6` | Wellbeing, healthcare, safety |
| **Legal** | Dark Blue | `#1E40AF` | Trust, authority, professional |
| **Uni Essentials** | Pink | `#EC4899` | Youthful, friendly, exciting |

### Design Principles

1. **Mobile-First**: Designed for phones first, scales up to tablet and desktop
2. **Accessibility**: WCAG AAA compliance - everyone can use this app
3. **Card-Based UI**: Flip cards with colored headers (Style B)
4. **Icon-First**: Minimize text, maximize visual communication
5. **Gamification**: Points, streaks, levels, badges, celebrations

### Typography

- **Font Stack**: System fonts for best performance
- **Base Size**: 16px (mobile), scales up on desktop
- **Headings**: Bold, clear hierarchy
- **Body Text**: 1.6 line-height for readability

### Spacing Scale
```
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  16px  (1rem)
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)
```

### Border Radius
```
sm:   4px   - Subtle rounding
md:   8px   - Default buttons
lg:   16px  - Cards
xl:   24px  - Large cards
full: 9999px - Fully rounded (pills)
```

---

## 🏗️ Project Structure
```
student-life-hub-v2/
├── index.html                     # Main landing page
├── README.md                      # This file
│
├── css/                           # All styling
│   ├── reset.css                  # Browser default removal
│   ├── variables.css              # Design tokens (colors, spacing)
│   ├── accessibility.css          # AAA accessibility features
│   ├── layout.css                 # Responsive grids & containers
│   ├── typography.css             # Text styling
│   ├── animations.css             # Transitions & effects
│   ├── gamification.css           # Points, badges, celebrations
│   │
│   ├── components/                # Reusable UI components
│   │   ├── buttons.css            # All button variants
│   │   ├── forms.css              # Inputs, checkboxes, validation
│   │   ├── modals.css             # Popups, dialogs, toasts
│   │   ├── navigation.css         # Header, tabs, mobile menu
│   │   └── cards.css              # Universal flip card system
│   │
│   └── sections/                  # Page-specific styles
│       ├── dashboard.css          # Dashboard layout
│       ├── study.css              # Study section
│       ├── meals.css              # Meals section
│       ├── cleaning.css           # Cleaning section
│       ├── budget.css             # Budget section
│       ├── diy.css                # DIY section
│       ├── support.css            # Support resources
│       ├── legal.css              # Legal information
│       └── uni-essentials.css     # Uni essentials checklists
│
├── js/                            # All functionality
│   ├── storage.js                 # localStorage utilities
│   ├── auth.js                    # Authentication (Firebase-ready)
│   ├── utils.js                   # Helper functions
│   │
│   ├── components/                # UI component logic
│   │   ├── cards.js               # Card rendering & flip
│   │   ├── modal.js               # Modal open/close
│   │   ├── filters.js             # Filter & search
│   │   ├── navigation.js          # Tab switching
│   │   └── notifications.js       # Push notifications
│   │
│   ├── features/                  # Special features
│   │   ├── gamification.js        # Points, streaks, achievements
│   │   ├── ai-suggestions.js      # Fake AI recommendations
│   │   ├── export.js              # PDF/CSV downloads
│   │   └── sync.js                # Firebase sync
│   │
│   └── pages/                     # Page-specific logic
│       ├── dashboard.js           # Dashboard functionality
│       ├── study.js               # Study features
│       ├── meals.js               # Meal browsing/planning
│       ├── planner.js             # Weekly planner
│       ├── shopping.js            # Shopping list
│       ├── cleaning.js            # Cleaning tasks
│       ├── budget.js              # Budget calculator
│       ├── diy.js                 # DIY tasks
│       ├── support.js             # Support resources
│       ├── legal.js               # Legal information
│       └── uni-essentials.js      # Checklists
│
├── data/                          # Content data (JSON)
│   ├── meals/
│   │   ├── free/                  # Free tier meals
│   │   └── premium/               # Premium meals
│   ├── tasks/                     # Task templates
│   ├── references.json            # External links & prices
│   ├── quotes.json                # Motivational quotes
│   └── achievements.json          # Badges & rewards
│
├── assets/                        # Media files
│   ├── icons/                     # Icon files
│   └── images/                    # Image files
│
├── pages/                         # HTML pages
│   ├── dashboard.html             # User dashboard
│   ├── study.html                 # Study planner
│   ├── meals.html                 # Meal browser
│   ├── planner.html               # Weekly planner
│   ├── shopping.html              # Shopping list
│   ├── cleaning.html              # Cleaning schedules
│   ├── budget.html                # Budget calculator
│   ├── diy.html                   # DIY & repairs
│   ├── support.html               # Support resources
│   ├── legal.html                 # Legal essentials
│   └── uni-essentials.html        # Uni checklists
│
└── admin/                         # Hidden admin dashboard
    ├── index.html                 # Admin home
    ├── references.html            # Update references
    ├── link-checker.html          # Check external links
    └── content-manager.html       # Manage content
```

---

## ✨ Key Features

### 🆓 Free Tier
- 50 rotating meal recipes
- Basic meal planner (1 week)
- Study timetable & techniques
- AI learning prompts & practice cards (50)
- Basic budget calculator
- Cleaning task library
- DIY repair guides
- Essential support resources
- Gamification (points, streaks, levels)

### 💎 Premium Tier (£2.99/month or £24.99/year)
- 300+ meal library
- 4-week meal planning
- Advanced shopping list (quantities + leftovers)
- Save favorites & routines
- Custom meal submissions
- Community meal ratings
- 250 AI practice cards
- Term view for study planner
- Budget food integration
- PDF/CSV exports
- Multi-device sync
- Priority features

---

## 🎮 Gamification System

### Points
Earn points for completing tasks:
- Complete study session: **10 points**
- Cook a meal: **15 points**
- Complete cleaning task: **5 points**
- Achieve daily goal: **25 points**

### Streaks
Track consecutive days of activity:
- 🔥 **7 days**: Week Warrior badge
- 🔥 **30 days**: Month Master badge
- 🔥 **100 days**: Century Champion badge

### Levels
Progress from **Fresher** → **Survivor** → **Master** → **Legend**
- Level up every 500 points
- Unlock new features and themes

### Achievements
50+ badges to collect:
- 🍳 **Meal Prep Master**: Cook 50 meals
- 📚 **Study Champion**: 100 study sessions
- 💰 **Budget Boss**: Track spending for 3 months
- 🧹 **Clean Sweep**: Complete all cleaning tasks

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: localStorage (offline-first)
- **Sync**: Firebase Firestore (free tier)
- **Auth**: Firebase Authentication
- **Payments**: Stripe (£2.99/month)
- **Hosting**: GitHub Pages (free, fast, reliable)
- **Maps**: Google Maps Embed API

### Why This Stack?

1. **No build tools** - Easy to maintain and update
2. **Works offline** - localStorage keeps data local
3. **Free hosting** - GitHub Pages is fast and free
4. **Scalable** - Firebase free tier handles 50k+ users
5. **Mobile-first** - Fast, responsive, no frameworks needed

---

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

---

## ♿ Accessibility Features

This app meets **WCAG AAA** standards:

- ✅ Keyboard navigation (all features work without mouse)
- ✅ Screen reader support (ARIA labels throughout)
- ✅ High contrast mode support
- ✅ Color contrast ratios 7:1 or better
- ✅ Focus indicators on all interactive elements
- ✅ Skip links for quick navigation
- ✅ Text-to-speech compatible
- ✅ Touch targets 44px minimum (mobile accessibility)
- ✅ Reduced motion support (respects user preferences)
- ✅ Alternative text for all images

---

## 🚀 Development Workflow

### Local Development

1. Clone repository
2. Open `index.html` in browser
3. Make changes to CSS/JS files
4. Refresh browser to see changes

### Deploying Updates
```bash
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages automatically rebuilds in 30 seconds.

### Adding New Meals

1. Create JSON file in `data/meals/free/` or `data/meals/premium/`
2. Follow schema:
```json
{
  "id": "unique-meal-id",
  "name": "Meal Name",
  "type": "breakfast|lunch|dinner|snack",
  "time": 20,
  "calories": 450,
  "cost": 3.50,
  "difficulty": "easy|moderate|difficult",
  "dietary": ["vegetarian", "vegan", "gluten-free"],
  "ingredients": [
    { "name": "Item", "amount": "200g", "cost": 1.50 }
  ],
  "equipment": ["Pan", "Knife"],
  "instructions": [
    "Step 1",
    "Step 2"
  ]
}
```

---

## 📊 Analytics & Tracking

Using Google Analytics to track:
- Feature usage (which sections are most popular)
- Meal views (which recipes are most viewed)
- Premium conversion rate
- User retention
- Device types
- Geographic distribution

**Privacy**: No personal data is shared. All tracking is anonymized.

---

## 🔒 Data Privacy

- All data stored locally in browser (localStorage)
- No personal data sent to servers without consent
- Firebase sync is opt-in (requires login)
- GDPR compliant
- Users can export and delete all data
- No tracking cookies (analytics only)

---

## 🎯 Roadmap

### Phase 1: MVP (Weeks 1-4)
- ✅ Core architecture
- ✅ Design system
- ✅ CSS framework
- ✅ JavaScript utilities
- 🔄 Study section
- 🔄 Meals section
- 🔄 Dashboard

### Phase 2: Feature Complete (Weeks 5-8)
- ⏳ Cleaning & DIY
- ⏳ Budget & Money
- ⏳ Uni Essentials
- ⏳ Support & Legal
- ⏳ Premium features

### Phase 3: Launch Ready (Weeks 9-12)
- ⏳ Firebase integration
- ⏳ Stripe payments
- ⏳ Admin dashboard
- ⏳ Beta testing
- ⏳ Landing page
- ⏳ Launch! 🚀

### Phase 4: Growth (Post-Launch)
- ⏳ Real AI integration (Claude API)
- ⏳ Social features (share meals/plans)
- ⏳ Mobile app (PWA)
- ⏳ University partnerships
- ⏳ Content expansion (1000+ meals)

---

## 👥 Contributing

This is a commercial project, but suggestions are welcome:
- Email: [your-email]
- Issues: Use GitHub Issues for bug reports

---

## 📄 License

**Proprietary Software** - All Rights Reserved  
© 2025-2026 Graeme Wright

This is a commercial product. The source code is private and may not be copied, modified, or distributed without explicit written permission from the copyright holder.

**Interested in licensing or partnerships?** Contact via email above.

---

## 🙏 Acknowledgments

Built with determination and 10-20 minute focused work sessions.

**Design Decisions:**
- Colors: Psychology-based section colors
- Cards: Header style (B) with flip animation (A)
- Approach: Mobile-first responsive design
- Accessibility: AAA level (maximum inclusion)

---

## 📞 Contact

**Founder & Developer**: Graeme Wright  
**Email**: [Your email address here]  
**LinkedIn**: [Your LinkedIn profile URL - optional]  
**Website**: https://graemewright2005-ux.github.io/student-life-hub-v2/

**About the Developer:**  
Built by an experienced educator with 18 years of teaching experience, including 12 years as a subject leader. This app combines pedagogical expertise with practical student support to help young adults thrive independently.
---

**Last Updated**: November 2025  
**Version**: 2.0.0  
**Status**: In Development (Foundation Complete ✅)