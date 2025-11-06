# Block System

This document explains how the block system works in AEM Edge Delivery Services.

## What is a Block?

A block is a self-contained, reusable component that:
- Has its own JavaScript and CSS
- Transforms content into interactive UI
- Can be used across multiple pages
- Is defined by content authors in documents

## Block Anatomy

Every block consists of three parts:

### 1. Content Definition (Author)

In a document (Word/Docs), authors create a table:

```
| Cards |
| --- |
| ![Image](image.png) |
| ## Title |
| Description text |
```

### 2. CSS Styling

```css
/* blocks/cards/cards.css */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.cards-card-image {
  aspect-ratio: 16/9;
}
```

### 3. JavaScript Enhancement

```javascript
// blocks/cards/cards.js
export default function decorate(block) {
  // Transform and enhance the block
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    // ... transformation logic
    ul.append(li);
  });
  block.replaceChildren(ul);
}
```

## Block Naming Convention

Block names use kebab-case and map to:

| Content | Class | Directory |
|---------|-------|-----------|
| `\| Cards \|` | `.cards` | `blocks/cards/` |
| `\| Hero Banner \|` | `.hero-banner` | `blocks/hero-banner/` |
| `\| Call To Action \|` | `.call-to-action` | `blocks/call-to-action/` |

## Block Structure

### Standard Block

```
blocks/
└── cards/
    ├── cards.js    # Required: JavaScript decoration
    └── cards.css   # Required: Block styles
```

### Complex Block

```
blocks/
└── form/
    ├── form.js          # Main block logic
    ├── form.css         # Block styles
    └── form-fields.js   # Additional module
```

## Block Decoration Process

### 1. Content to HTML Conversion

The framework converts tables to HTML:

**Input (Document):**
```
| Cards |
| --- |
| Content for card 1 |
| Content for card 2 |
```

**Output (Initial HTML):**
```html
<div class="cards block" data-block-name="cards">
  <div>
    <div>Content for card 1</div>
  </div>
  <div>
    <div>Content for card 2</div>
  </div>
</div>
```

### 2. JavaScript Decoration

Your `decorate()` function transforms this HTML:

```javascript
export default function decorate(block) {
  // Access block.children - each is a row
  [...block.children].forEach((row) => {
    // Transform each row
    // Add classes, create elements, etc.
  });
}
```

**Final HTML:**
```html
<div class="cards block" data-block-name="cards">
  <ul>
    <li class="cards-card">
      <div class="cards-card-body">Content for card 1</div>
    </li>
    <li class="cards-card">
      <div class="cards-card-body">Content for card 2</div>
    </li>
  </ul>
</div>
```

## Block Loading Strategy

Blocks load in three phases:

### 1. Eager Loading (LCP)

Critical blocks load immediately:
- Header
- First content section (typically hero)

```javascript
// In scripts.js
async function loadEager(doc) {
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    await loadSections(main);
  }
}
```

### 2. Lazy Loading

Below-the-fold blocks load after page interaction:
- Remaining sections
- Non-critical blocks

```javascript
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);
  // ... load footer, etc.
}
```

### 3. Delayed Loading

Non-essential features load last:
- Analytics
- Cookie consent
- Tracking pixels

```javascript
async function loadDelayed() {
  // Load delayed scripts
  await loadCSS(`${window.hlx.codeBasePath}/styles/delayed.css`);
}
```

## Block Variants

Blocks can have variants defined by authors:

**Content:**
```
| Cards (dark, centered) |
| --- |
| Content |
```

**HTML:**
```html
<div class="cards dark centered block">
  <!-- content -->
</div>
```

**CSS:**
```css
.cards.dark {
  background: black;
  color: white;
}

.cards.centered {
  text-align: center;
}
```

## Working with Images

### Basic Image Handling

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  block.querySelectorAll('img').forEach((img) => {
    const optimizedPicture = createOptimizedPicture(
      img.src,
      img.alt,
      false, // eager loading
      [{ width: '750' }] // breakpoints
    );
    img.closest('picture').replaceWith(optimizedPicture);
  });
}
```

### Image Optimization

Images are automatically optimized:
- WebP format with fallback
- Responsive sizes
- Lazy loading (except eager blocks)

## Block Configuration

### Reading Block Config

When authors provide key-value pairs:

**Content:**
```
| Cards |
| --- |
| Title | My Cards |
| Columns | 3 |
```

**JavaScript:**
```javascript
import { readBlockConfig } from '../../scripts/aem.js';

export default function decorate(block) {
  const config = readBlockConfig(block);
  // config = { title: 'My Cards', columns: '3' }
}
```

## Block Communication

### Events

Blocks can communicate via custom events:

```javascript
// Dispatching
document.dispatchEvent(new CustomEvent('modal:open', {
  detail: { id: 'login-modal' }
}));

// Listening
document.addEventListener('modal:open', (e) => {
  const { id } = e.detail;
  // Handle modal open
});
```

### Shared State

Use `window.hlx` for shared state:

```javascript
// Set state
window.hlx.myFeature = { enabled: true };

// Read state
if (window.hlx.myFeature?.enabled) {
  // Do something
}
```

## Best Practices

### 1. Keep Blocks Simple

- One responsibility per block
- Minimal dependencies
- Self-contained functionality

### 2. Progressive Enhancement

```javascript
export default function decorate(block) {
  // 1. Basic HTML structure (works without JS)
  const button = block.querySelector('button');
  
  // 2. Add interactivity
  button?.addEventListener('click', () => {
    // Enhanced behavior
  });
}
```

### 3. Semantic HTML

```javascript
// Good
const ul = document.createElement('ul');
const li = document.createElement('li');

// Avoid
const div = document.createElement('div');
div.className = 'fake-list';
```

### 4. Accessibility

```javascript
// Add ARIA labels
button.setAttribute('aria-label', 'Open menu');

// Manage focus
dialog.setAttribute('role', 'dialog');
dialog.setAttribute('aria-modal', 'true');
```

### 5. Performance

```javascript
// Load heavy dependencies only when needed
if (needsChart) {
  const { Chart } = await import('./chart-library.js');
  renderChart(Chart);
}
```

## Common Patterns

### List-Based Blocks

```javascript
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
```

### Interactive Blocks

```javascript
export default function decorate(block) {
  const button = block.querySelector('button');
  const content = block.querySelector('.content');
  
  button.addEventListener('click', () => {
    content.classList.toggle('expanded');
  });
}
```

### Async Data Loading

```javascript
export default async function decorate(block) {
  const dataUrl = block.dataset.source;
  
  try {
    const response = await fetch(dataUrl);
    const data = await response.json();
    renderData(block, data);
  } catch (error) {
    block.textContent = 'Failed to load content';
  }
}
```

## Testing Blocks

### Local Testing

1. Start AEM CLI: `aem up`
2. Create test document with your block
3. View at `http://localhost:3000`

### Browser Testing

```javascript
// In browser console
const block = document.querySelector('.cards');
import('/blocks/cards/cards.js')
  .then(module => module.default(block));
```

## Next Steps

- [Creating a Custom Block](../how-to/creating-blocks.md) - Build your first block
- [Styling Blocks](../how-to/styling-blocks.md) - Style best practices
- [Core Utilities API](../reference/core-utilities.md) - Available helper functions
