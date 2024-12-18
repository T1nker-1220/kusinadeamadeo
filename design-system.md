# Kusina De Amadeo Design System

## Brand Identity

### Logo Usage
- Primary logo: `/public/images/logo.png`
- Minimum size: 32px height
- Clear space: 1x logo height on all sides
- Usage:
  ```tsx
  <Image
    src="/images/logo.png"
    alt="Kusina De Amadeo"
    width={180}
    height={40}
    className="object-contain"
    priority
  />
  ```

## Color System

### Theme Colors
```css
:root {
  /* Core Theme Colors */
  --brand-orange: #FF6B00;
  --brand-orange-light: #FF8534;
  --brand-orange-dark: #E65000;
  
  /* Adaptive Dark Theme */
  --surface-primary: #121212;
  --surface-secondary: #1E1E1E;
  --surface-elevated: #2D2D2D;
  
  /* Dynamic Text Colors */
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.87);
  --text-tertiary: rgba(255, 255, 255, 0.6);
  
  /* Semantic Colors */
  --success: #4CAF50;
  --warning: #FFC107;
  --error: #FF5252;
  
  /* Interactive States */
  --hover-overlay: rgba(255, 255, 255, 0.1);
  --active-overlay: rgba(255, 255, 255, 0.15);
  --disabled-overlay: rgba(255, 255, 255, 0.05);
  
  /* Gradients */
  --gradient-brand: linear-gradient(135deg, var(--brand-orange), var(--brand-orange-light));
  --gradient-surface: linear-gradient(135deg, var(--surface-primary), var(--surface-secondary));
}
```

## Typography System

### Font Families
```css
:root {
  /* Modern Font Stack */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-accent: 'Montserrat', var(--font-body);
}
```

### Type Scale
```css
:root {
  /* Fluid Typography Scale */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --text-3xl: clamp(2rem, 1.8rem + 1.25vw, 2.5rem);
  --text-4xl: clamp(2.5rem, 2.3rem + 1.5vw, 3rem);
  
  /* Line Heights */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Letter Spacing */
  --tracking-tight: -0.015em;
  --tracking-normal: 0;
  --tracking-wide: 0.015em;
}
```

### Typography Styles
```css
/* Heading Styles */
.heading-display {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-tight);
}

.heading-accent {
  font-family: var(--font-accent);
  font-weight: 600;
  letter-spacing: var(--tracking-normal);
  text-transform: uppercase;
}

/* Body Styles */
.body-text {
  font-family: var(--font-body);
  font-weight: 400;
  line-height: var(--leading-normal);
}

.body-emphasis {
  font-family: var(--font-body);
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
}
```

## Flexible Component System

### Base Components
```css
/* Adaptive Card Base */
.card {
  background: var(--surface-secondary);
  border-radius: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
}

/* Dynamic Button Styles */
.button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  
  &--primary {
    background: var(--gradient-brand);
    color: var(--text-primary);
    
    &:hover {
      filter: brightness(1.1);
    }
  }
}

/* Flexible Container */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (min-width: 640px) {
    padding: 0 2rem;
  }
}
```

### Animation Utilities
```css
:root {
  /* Customizable Animation Tokens */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
  
  /* Animation Curves */
  --ease-out: cubic-bezier(0.33, 1, 0.68, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Reusable Animation Classes */
.animate-fade {
  transition: opacity var(--transition-normal);
}

.animate-scale {
  transition: transform var(--transition-normal) var(--spring);
}

.animate-slide {
  transition: transform var(--transition-normal) var(--ease-out);
}
```

### Responsive Patterns
```css
/* Flexible Grid System */
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
}

/* Adaptive Stack */
.stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
}
```

## Mobile-First Design System

### Touch Interaction Patterns
```css
:root {
  /* Touch Target Sizes */
  --touch-target-min: 44px;
  --touch-target-spacing: 8px;
  
  /* Safe Areas */
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  --bottom-nav-height: calc(60px + var(--safe-area-inset-bottom));
}

/* Touch-Friendly Buttons */
.touch-button {
  min-height: var(--touch-target-min);
  min-width: var(--touch-target-min);
  padding: 12px 16px;
  margin: var(--touch-target-spacing);
  border-radius: 8px;
  
  &--icon {
    display: grid;
    place-items: center;
    aspect-ratio: 1;
  }
}

/* Bottom Sheet Pattern */
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface-elevated);
  border-radius: 20px 20px 0 0;
  padding: 16px;
  padding-bottom: calc(16px + var(--safe-area-inset-bottom));
  transform: translateY(0);
  transition: transform var(--transition-normal) var(--ease-out);
  
  &--hidden {
    transform: translateY(100%);
  }
  
  &__handle {
    width: 32px;
    height: 4px;
    background: var(--text-tertiary);
    border-radius: 2px;
    margin: 0 auto 16px;
  }
}

/* Mobile Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-nav-height);
  background: var(--surface-elevated);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: var(--safe-area-inset-bottom);
  z-index: 1000;
}

/* Swipe Actions */
.swipe-action {
  position: relative;
  overflow: hidden;
  touch-action: pan-x;
  
  &__content {
    transform: translateX(0);
    transition: transform var(--transition-normal);
  }
  
  &__action {
    position: absolute;
    top: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    min-width: 80px;
  }
}

/* Pull to Refresh */
.pull-refresh {
  overflow-y: auto;
  overscroll-behavior-y: contain;
  
  &__indicator {
    height: 50px;
    display: grid;
    place-items: center;
    transform: translateY(-100%);
  }
}
```

### Mobile Layout Patterns
```css
/* Content Safe Areas */
.mobile-container {
  padding: 16px;
  padding-bottom: calc(var(--bottom-nav-height) + 16px);
  max-width: 100%;
  margin: 0 auto;
  
  @media (min-width: 640px) {
    max-width: 640px;
  }
}

/* Scroll Containers */
.scroll-container {
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  display: flex;
  gap: 12px;
  padding: 16px;
  margin: 0 -16px;
  
  &__item {
    scroll-snap-align: start;
    flex: 0 0 auto;
    width: calc(100% - 32px);
    
    @media (min-width: 640px) {
      width: 300px;
    }
  }
}

/* Mobile Grid */
.mobile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  padding: 16px;
}
```

### Mobile-Specific Components
```css
/* Mobile Cards */
.mobile-card {
  background: var(--surface-secondary);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  &--interactive {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--hover-overlay);
      opacity: 0;
      transition: opacity var(--transition-fast);
    }
    
    &:active::after {
      opacity: 1;
    }
  }
}

/* Mobile List Items */
.list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  min-height: var(--touch-target-min);
  
  &__leading {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
  }
  
  &__content {
    flex: 1;
    min-width: 0;
  }
  
  &__trailing {
    flex-shrink: 0;
  }
}

/* Mobile Form Elements */
.mobile-input {
  width: 100%;
  height: var(--touch-target-min);
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--surface-elevated);
  color: var(--text-primary);
  
  &::placeholder {
    color: var(--text-tertiary);
  }
}

.mobile-select {
  appearance: none;
  width: 100%;
  height: var(--touch-target-min);
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--surface-elevated);
  color: var(--text-primary);
}
```

### Mobile Typography Adjustments
```css
/* Mobile-Optimized Text */
.mobile-text {
  &--title {
    font-size: var(--text-xl);
    font-weight: 600;
    letter-spacing: var(--tracking-tight);
  }
  
  &--subtitle {
    font-size: var(--text-base);
    color: var(--text-secondary);
  }
  
  &--caption {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
  }
}
```

## Admin Interface Design System

### Admin Layout Components
```css
/* Admin Dashboard Layout */
.admin-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  
  &__header {
    padding: 16px;
    background: var(--surface-elevated);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  &__content {
    padding: 16px;
    overflow-y: auto;
  }
}

/* Admin Cards */
.admin-card {
  background: var(--surface-secondary);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  
  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  
  &__title {
    font-weight: 600;
    font-size: var(--text-lg);
  }
  
  &__content {
    display: grid;
    gap: 12px;
  }
}

/* Admin List Items */
.admin-list-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: var(--surface-primary);
  
  &:hover {
    background: var(--surface-hover);
  }
  
  &__actions {
    display: flex;
    gap: 8px;
  }
}

/* Admin Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
  
  &__button {
    padding: 16px;
    text-align: center;
    background: var(--surface-secondary);
    border-radius: 8px;
    
    &:hover {
      background: var(--surface-hover);
    }
  }
}

/* Admin Stats Card */
.stats-card {
  padding: 16px;
  border-radius: 8px;
  background: var(--surface-secondary);
  
  &__number {
    font-size: var(--text-2xl);
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  &__label {
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }
}
```

### Admin Mobile Optimizations
```css
/* Mobile Admin Navigation */
.admin-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface-elevated);
  padding: 8px 16px;
  padding-bottom: calc(8px + var(--safe-area-inset-bottom));
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  z-index: 100;
  
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    border-radius: 8px;
    
    &:hover {
      background: var(--surface-hover);
    }
    
    &--active {
      color: var(--primary-color);
      background: var(--primary-color-light);
    }
  }
}

/* Mobile Order Management */
.order-card {
  background: var(--surface-secondary);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  
  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  
  &__id {
    font-weight: 600;
  }
  
  &__status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: var(--text-sm);
    
    &--pending {
      background: var(--warning-color-light);
      color: var(--warning-color);
    }
    
    &--completed {
      background: var(--success-color-light);
      color: var(--success-color);
    }
  }
  
  &__actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }
}
```

## Component Patterns

### Card Designs
```css
/* Product Card */
.product-card {
  @apply relative overflow-hidden rounded-xl bg-dark-bg-secondary;
  
  /* Glass Effect */
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  /* Hover Effects */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
  
  /* Image Container */
  .image-container {
    @apply relative aspect-[4/3] overflow-hidden;
    
    img {
      @apply object-cover transition-transform duration-300;
    }
    
    &:hover img {
      transform: scale(1.05);
    }
  }
  
  /* Content */
  .content {
    @apply p-4 space-y-2;
    
    h3 {
      @apply font-display text-lg text-text-primary;
    }
    
    .price {
      @apply text-orange-primary font-semibold;
    }
  }
}

/* Featured Card */
.featured-card {
  @apply relative overflow-hidden rounded-2xl;
  background: linear-gradient(135deg, rgba(255, 107, 0, 0.1), rgba(255, 133, 52, 0.1));
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 107, 0, 0.2);
}
```

### Button Styles
```css
/* Base Button */
.btn {
  @apply inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-all;
  
  /* Variants */
  &-primary {
    @apply bg-gradient-to-r from-orange-primary to-orange-secondary text-white;
    &:hover {
      @apply brightness-110;
    }
  }
  
  &-secondary {
    @apply bg-dark-bg-secondary text-text-primary border border-orange-primary/20;
    &:hover {
      @apply bg-dark-bg-tertiary border-orange-primary/40;
    }
  }
  
  &-ghost {
    @apply text-text-primary hover:bg-dark-bg-secondary;
  }
  
  /* Sizes */
  &-sm { @apply text-sm px-3 py-1.5; }
  &-lg { @apply text-lg px-6 py-3; }
}
```

### Navigation Components
```css
/* Navbar */
.navbar {
  @apply fixed top-0 w-full z-50;
  background: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  .nav-link {
    @apply relative px-4 py-2 text-text-secondary hover:text-text-primary transition-colors;
    
    &::after {
      content: '';
      @apply absolute bottom-0 left-0 w-full h-0.5 bg-orange-primary scale-x-0 transition-transform;
    }
    
    &:hover::after,
    &.active::after {
      @apply scale-x-100;
    }
  }
}
```

### Form Elements
```css
/* Input Fields */
.input {
  @apply w-full px-4 py-2 rounded-lg bg-dark-bg-secondary border border-white/10;
  @apply text-text-primary placeholder:text-text-tertiary;
  @apply focus:outline-none focus:border-orange-primary/50 focus:ring-1 focus:ring-orange-primary/50;
  @apply transition-all duration-200;
}

/* Select */
.select {
  @apply appearance-none bg-dark-bg-secondary;
  @apply border border-white/10 rounded-lg px-4 py-2;
  @apply text-text-primary;
  background-image: url("data:image/svg+xml,...");
  background-position: right 1rem center;
  background-repeat: no-repeat;
}
```

### Hero Section
```css
.hero {
  @apply relative min-h-[70vh] flex items-center;
  background: linear-gradient(to bottom, rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.95)),
              url('/images/hero.jpg') center/cover;
  
  .content {
    @apply container mx-auto px-4 py-20;
    
    h1 {
      @apply font-display text-4xl md:text-5xl lg:text-6xl;
      @apply bg-gradient-to-r from-orange-primary to-orange-secondary;
      @apply bg-clip-text text-transparent;
    }
  }
}
```

### Menu Grid
```css
.menu-grid {
  @apply grid gap-6;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  
  @screen md {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  
  @screen lg {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}
```

### Visual Effects

#### Glassmorphism
```css
.glass {
  background: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.glass-orange {
  background: rgba(255, 107, 0, 0.1);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 107, 0, 0.2);
  border-radius: 12px;
}
```

#### Shadows
```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 0 20px rgba(255, 107, 0, 0.2);
}
```

### Animations
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

.animate-pulse {
  animation: pulse 2s infinite;
}
```

### Loading States
```css
.skeleton {
  @apply relative overflow-hidden bg-dark-bg-secondary rounded-lg;
  
  &::after {
    content: '';
    @apply absolute inset-0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    animation: shimmer 1.5s infinite;
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### Responsive Patterns
```css
/* Container */
.container {
  @apply mx-auto px-4;
  max-width: min(1200px, 100% - 2rem);
}

/* Grid System */
.grid-auto-fit {
  @apply grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
}

/* Spacing */
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
}
```

### Image Assets
- Hero Image: `/public/images/hero.jpg`
- Menu Hero: `/public/images/menu-hero.jpg`
- About Hero: `/public/images/about-hero.jpg`
- Location QR: `/public/images/location-qr.png`
- Product Images: `/public/images/products/`
- Category Images: `/public/images/categories/`
- Feature Images: `/public/images/features/`
- About Images: `/public/images/about/`

## Accessibility Guidelines
- Minimum contrast ratio: 4.5:1 for normal text
- Focus states: Visible focus rings on interactive elements
- Semantic HTML: Use proper heading hierarchy
- ARIA labels: Provide clear labels for interactive elements
- Keyboard navigation: Ensure all interactions are keyboard accessible

## Performance Guidelines
- Image optimization: Use Next.js Image component
- Lazy loading: Implement for below-fold content
- Bundle optimization: Code splitting and dynamic imports
- Caching strategy: Implement proper caching headers
- Core Web Vitals targets:
  - LCP: < 2.5s
  - FID: < 100ms
  - CLS: < 0.1