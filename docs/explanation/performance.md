# Performance Considerations

AEM Edge Delivery Services is designed for exceptional performance. This document explains how to maintain and optimize performance in your blocks and pages.

## Performance Goals

Edge Delivery Services targets:
- **100% Lighthouse scores** across all metrics
- **Sub-second page loads** globally
- **Instant interactions** with minimal JavaScript
- **Core Web Vitals excellence** for SEO

## Loading Strategy

### Three-Phase Loading

The framework loads content in three phases to optimize performance:

#### 1. Eager Loading (Critical Path)

**What loads:**
- Base HTML and CSS
- Header block
- First content section (above the fold)

**Why:**
- Optimizes Largest Contentful Paint (LCP)
- Shows content immediately
- Critical for perceived performance

**Implementation:**
```javascript
async function loadEager(doc) {
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    await loadSection(main.querySelector('.section'));
  }
}
```

#### 2. Lazy Loading (Below the Fold)

**What loads:**
- Remaining page sections
- Footer
- Non-critical blocks

**Why:**
- Reduces initial bundle size
- Prioritizes above-the-fold content
- Improves Time to Interactive (TTI)

**Implementation:**
```javascript
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);
  await loadHeader(doc.querySelector('header'));
  await loadFooter(doc.querySelector('footer'));
}
```

#### 3. Delayed Loading (Analytics & Tracking)

**What loads:**
- Analytics scripts
- Tracking pixels
- Cookie consent
- Non-essential features

**Why:**
- Doesn't block user interaction
- Improves all performance metrics
- Reduces competition for network resources

```javascript
async function loadDelayed() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/delayed.css`);
  // Load analytics, tracking, etc.
}
```

## Image Optimization

### Automatic Optimization

All images are automatically optimized:

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';

// Single size
const picture = createOptimizedPicture(
  img.src,
  img.alt,
  false, // lazy load
  [{ width: '750' }]
);

// Responsive sizes
const picture = createOptimizedPicture(
  img.src,
  img.alt,
  false,
  [
    { media: '(min-width: 600px)', width: '2000' },
    { width: '750' }
  ]
);
```

### Image Best Practices

**1. Use appropriate sizes:**
```javascript
// Hero images (full width)
[{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }]

// Card images (partial width)
[{ width: '750' }]

// Thumbnail images
[{ width: '350' }]
```

**2. Lazy load by default:**
```javascript
// Lazy load (default, recommended)
createOptimizedPicture(src, alt, false, sizes);

// Eager load (only for LCP images)
createOptimizedPicture(src, alt, true, sizes);
```

**3. Optimize alt text:**
```html
<!-- Good: Descriptive -->
<img alt="Team celebrating product launch in office">

<!-- Bad: Generic -->
<img alt="Image">
```

## CSS Performance

### Block-Specific CSS

Each block loads its own CSS:

**Benefits:**
- Only loads CSS for blocks on the page
- Reduces unused CSS
- Improves First Contentful Paint (FCP)

**Structure:**
```css
/* blocks/cards/cards.css - Loaded only when cards block is present */
.cards {
  /* Block-specific styles */
}
```

### Global CSS

Keep global CSS minimal:

```css
/* styles/styles.css - Loads on every page */
:root {
  /* CSS variables only */
  --color-primary: #007bff;
}

body {
  /* Essential base styles only */
  font-family: system-ui;
}
```

### CSS Best Practices

**1. Use CSS custom properties:**
```css
:root {
  --spacing-small: 0.5rem;
  --spacing-medium: 1rem;
  --spacing-large: 2rem;
}

.cards {
  gap: var(--spacing-medium);
}
```

**2. Avoid expensive properties:**
```css
/* Avoid - triggers reflow */
.block {
  position: fixed;
  width: calc(100% - var(--dynamic-value));
}

/* Prefer - GPU-accelerated */
.block {
  transform: translateX(var(--offset));
  will-change: transform;
}
```

**3. Minimize specificity:**
```css
/* Good - Low specificity */
.cards-item { }

/* Avoid - High specificity */
div.cards ul li.cards-item > div { }
```

## JavaScript Performance

### Minimal JavaScript

**Key Principles:**
- No frameworks (React, Vue, etc.)
- No build tools required
- ES6 modules only
- Vanilla JavaScript

### Async Operations

**1. Use async/await for I/O:**
```javascript
export default async function decorate(block) {
  const response = await fetch('/data.json');
  const data = await response.json();
  render(block, data);
}
```

**2. Load heavy dependencies dynamically:**
```javascript
// Load only when needed
button.addEventListener('click', async () => {
  const { Chart } = await import('./chart-library.js');
  renderChart(data);
});
```

### DOM Manipulation

**1. Batch DOM updates:**
```javascript
// Good - Single DOM update
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item;
  fragment.appendChild(li);
});
list.appendChild(fragment);

// Avoid - Multiple DOM updates
items.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item;
  list.appendChild(li); // Triggers reflow each time
});
```

**2. Cache DOM queries:**
```javascript
// Good
const button = block.querySelector('button');
const handler = () => { /* ... */ };
button.addEventListener('click', handler);

// Avoid
block.querySelector('button').addEventListener('click', () => {
  block.querySelector('.content').classList.toggle('open');
});
```

**3. Use event delegation:**
```javascript
// Good - Single event listener
list.addEventListener('click', (e) => {
  if (e.target.matches('.item-button')) {
    handleItemClick(e.target);
  }
});

// Avoid - Multiple event listeners
items.forEach(item => {
  item.querySelector('button').addEventListener('click', handleItemClick);
});
```

## Network Performance

### Resource Hints

Use resource hints for critical resources:

```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- Prefetch next page -->
<link rel="prefetch" href="/next-page">
```

### Lazy Loading

**1. Intersection Observer for images:**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

images.forEach(img => observer.observe(img));
```

**2. Defer non-critical content:**
```javascript
// Load content when user scrolls near it
const contentObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadBlockContent(entry.target);
      contentObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '200px' }); // Load 200px before visible
```

## Measuring Performance

### Core Web Vitals

**Largest Contentful Paint (LCP):**
- Target: < 2.5s
- Optimize: Hero images, above-the-fold content
- Monitor: `waitForFirstImage()` utility

**First Input Delay (FID):**
- Target: < 100ms
- Optimize: Reduce JavaScript execution time
- Monitor: Event handler performance

**Cumulative Layout Shift (CLS):**
- Target: < 0.1
- Optimize: Reserve space for images/embeds
- Monitor: Layout shifts in development

### Real User Monitoring (RUM)

The framework includes RUM by default:

```javascript
import { sampleRUM } from './aem.js';

// Track custom checkpoints
sampleRUM('block-loaded', { block: 'cards' });
sampleRUM('user-action', { action: 'form-submit' });
```

### Local Testing

**1. Lighthouse:**
```bash
# Run Lighthouse
npx lighthouse http://localhost:3000 --view

# Target scores
Performance: 100
Accessibility: 100
Best Practices: 100
SEO: 100
```

**2. Chrome DevTools:**
- Network panel: Check resource loading
- Performance panel: Profile JavaScript execution
- Coverage panel: Identify unused CSS/JS

## Common Performance Issues

### Issue 1: Large JavaScript Bundles

**Problem:**
```javascript
// Loading entire library
import Chart from 'chart-library';
```

**Solution:**
```javascript
// Load only when needed
const loadChart = async () => {
  const { Chart } = await import('chart-library');
  return Chart;
};
```

### Issue 2: Layout Shift

**Problem:**
```html
<!-- Image without dimensions -->
<img src="hero.jpg" alt="Hero">
```

**Solution:**
```html
<!-- Reserve space with aspect ratio -->
<img src="hero.jpg" alt="Hero" style="aspect-ratio: 16/9">
```

### Issue 3: Blocking Resources

**Problem:**
```html
<!-- Blocking script in head -->
<script src="analytics.js"></script>
```

**Solution:**
```javascript
// Load in delayed phase
async function loadDelayed() {
  const script = document.createElement('script');
  script.src = '/analytics.js';
  document.head.append(script);
}
```

### Issue 4: Excessive DOM Queries

**Problem:**
```javascript
// Querying DOM repeatedly
button.addEventListener('click', () => {
  document.querySelector('.modal').classList.add('open');
  document.querySelector('.overlay').classList.add('visible');
});
```

**Solution:**
```javascript
// Cache DOM references
const modal = block.querySelector('.modal');
const overlay = block.querySelector('.overlay');
button.addEventListener('click', () => {
  modal.classList.add('open');
  overlay.classList.add('visible');
});
```

## Performance Checklist

- [ ] Images use `createOptimizedPicture()`
- [ ] Critical content loads eagerly
- [ ] Below-the-fold content loads lazily
- [ ] Analytics loads in delayed phase
- [ ] CSS is block-specific
- [ ] JavaScript is minimal and async
- [ ] DOM queries are cached
- [ ] Event delegation is used
- [ ] Layout shifts are prevented
- [ ] Lighthouse scores 100 across all metrics

## Next Steps

- [Block System](./block-system.md) - Understand block loading
- [Core Utilities API](../reference/core-utilities.md) - Available optimization functions
- [Creating Blocks](../how-to/creating-blocks.md) - Build performant blocks
