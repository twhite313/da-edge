# Creating Custom Blocks

This guide shows you how to create custom blocks for your AEM Edge Delivery Services project.

## Prerequisites

- Completed [Getting Started](../tutorials/getting-started.md) tutorial
- Understanding of [Block System](../explanation/block-system.md) concepts
- Familiarity with JavaScript ES6+ and CSS

## Planning Your Block

Before writing code, consider:

1. **Purpose** - What problem does this block solve?
2. **Content Structure** - What content will authors provide?
3. **Interactivity** - Does it need JavaScript behavior?
4. **Variants** - Will it have multiple styles/options?
5. **Accessibility** - How will screen readers interact with it?

## Block Creation Steps

### Step 1: Create Block Directory

```bash
# Replace 'my-block' with your block name (kebab-case)
mkdir -p blocks/my-block
```

### Step 2: Create JavaScript File

Create `blocks/my-block/my-block.js`:

```javascript
/**
 * Decorates the my-block block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // Your block decoration logic
}
```

### Step 3: Create CSS File

Create `blocks/my-block/my-block.css`:

```css
.my-block {
  /* Your block styles */
}
```

## Block Patterns

### Pattern 1: Simple Content Block

**Use case:** Display formatted content without complex logic.

**Example: Quote Block**

```javascript
// blocks/quote/quote.js
export default function decorate(block) {
  const quote = block.querySelector('p');
  const author = block.querySelector('p:last-child');
  
  if (author) {
    author.classList.add('quote-author');
  }
  
  block.classList.add('quote-styled');
}
```

```css
/* blocks/quote/quote.css */
.quote {
  border-left: 4px solid var(--color-primary);
  padding-left: 2rem;
  font-style: italic;
  margin: 2rem 0;
}

.quote-author {
  font-weight: bold;
  font-style: normal;
  margin-top: 1rem;
}

.quote-author::before {
  content: '— ';
}
```

### Pattern 2: List-Based Block

**Use case:** Transform rows into list items.

**Example: Feature List Block**

```javascript
// blocks/features/features.js
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'features-list';
  
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'features-item';
    
    // Move content to list item
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }
    
    // Identify and style image
    const picture = li.querySelector('picture');
    if (picture) {
      picture.parentElement.classList.add('features-image');
    }
    
    // Style text content
    const paragraphs = li.querySelectorAll('p');
    if (paragraphs.length > 0) {
      paragraphs[0].classList.add('features-title');
      const body = document.createElement('div');
      body.className = 'features-body';
      [...paragraphs].slice(1).forEach(p => body.append(p));
      li.append(body);
    }
    
    ul.append(li);
  });
  
  // Optimize images
  ul.querySelectorAll('img').forEach((img) => {
    const optimized = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '400' }]
    );
    img.closest('picture').replaceWith(optimized);
  });
  
  block.textContent = '';
  block.append(ul);
}
```

```css
/* blocks/features/features.css */
.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  list-style: none;
  padding: 0;
  margin: 2rem 0;
}

.features-item {
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.features-image {
  margin-bottom: 1rem;
}

.features-image img {
  width: 100%;
  height: auto;
}

.features-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.features-body {
  color: #666;
}
```

### Pattern 3: Interactive Block

**Use case:** Blocks with user interactions (tabs, accordions, modals).

**Example: FAQ Accordion**

```javascript
// blocks/faq/faq.js
export default function decorate(block) {
  const items = [...block.children];
  
  items.forEach((item) => {
    // Create accordion structure
    const question = item.children[0];
    const answer = item.children[1];
    
    question.classList.add('faq-question');
    answer.classList.add('faq-answer');
    
    // Add expand/collapse button
    const button = document.createElement('button');
    button.className = 'faq-toggle';
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = `
      ${question.innerHTML}
      <span class="faq-icon" aria-hidden="true">+</span>
    `;
    
    // Replace question with button
    question.replaceWith(button);
    
    // Hide answer by default
    answer.hidden = true;
    
    // Toggle on click
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      
      // Close all other items (optional)
      block.querySelectorAll('.faq-toggle').forEach((btn) => {
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('.faq-icon').textContent = '+';
        btn.nextElementSibling.hidden = true;
      });
      
      // Toggle this item
      if (!isExpanded) {
        button.setAttribute('aria-expanded', 'true');
        button.querySelector('.faq-icon').textContent = '−';
        answer.hidden = false;
      }
    });
  });
}
```

```css
/* blocks/faq/faq.css */
.faq {
  max-width: 800px;
  margin: 2rem auto;
}

.faq > div {
  border-bottom: 1px solid #e0e0e0;
}

.faq-toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  background: none;
  border: none;
  text-align: left;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
}

.faq-toggle:hover {
  color: var(--color-primary);
}

.faq-icon {
  font-size: 1.5rem;
  font-weight: normal;
  color: var(--color-primary);
}

.faq-answer {
  padding-bottom: 1.5rem;
}

.faq-answer p {
  margin: 0.5rem 0;
}
```

### Pattern 4: Data-Loading Block

**Use case:** Fetch and display external data.

**Example: Latest Posts Block**

```javascript
// blocks/latest-posts/latest-posts.js
export default async function decorate(block) {
  // Show loading state
  block.innerHTML = '<p>Loading posts...</p>';
  
  try {
    // Fetch data
    const response = await fetch('/query-index.json');
    const data = await response.json();
    
    // Get latest 3 posts
    const posts = data.data
      .filter(item => item.path.startsWith('/blog/'))
      .slice(0, 3);
    
    // Clear loading state
    block.innerHTML = '';
    
    // Create list
    const ul = document.createElement('ul');
    ul.className = 'latest-posts-list';
    
    posts.forEach((post) => {
      const li = document.createElement('li');
      li.className = 'latest-posts-item';
      li.innerHTML = `
        <a href="${post.path}">
          <h3>${post.title}</h3>
          <p>${post.description}</p>
          <time datetime="${post.date}">${new Date(post.date * 1000).toLocaleDateString()}</time>
        </a>
      `;
      ul.append(li);
    });
    
    block.append(ul);
  } catch (error) {
    block.innerHTML = '<p>Failed to load posts. Please try again later.</p>';
    console.error('Failed to load posts:', error);
  }
}
```

### Pattern 5: Configuration-Based Block

**Use case:** Block behavior configured by content authors.

**Example: Configurable Gallery**

```javascript
// blocks/gallery/gallery.js
import { readBlockConfig, createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Read configuration
  const config = readBlockConfig(block);
  const columns = parseInt(config.columns || '3', 10);
  const gap = config.gap || '1rem';
  const aspectRatio = config['aspect-ratio'] || '1/1';
  
  // Transform to gallery
  const gallery = document.createElement('div');
  gallery.className = 'gallery-grid';
  gallery.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  gallery.style.gap = gap;
  
  block.querySelectorAll('picture').forEach((picture) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.aspectRatio = aspectRatio;
    
    const img = picture.querySelector('img');
    const optimized = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '800' }]
    );
    
    item.append(optimized);
    gallery.append(item);
  });
  
  block.textContent = '';
  block.append(gallery);
}
```

**Content structure:**
```
| Gallery |
| --- |
| Columns | 4 |
| Gap | 2rem |
| Aspect Ratio | 16/9 |
| ![Image 1](img1.jpg) |
| ![Image 2](img2.jpg) |
```

## Block Variants

### Adding Variant Support

Variants allow authors to change block appearance without code changes.

**CSS:**
```css
/* Base block */
.my-block {
  padding: 2rem;
  background: white;
}

/* Dark variant */
.my-block.dark {
  background: #1a1a1a;
  color: white;
}

/* Compact variant */
.my-block.compact {
  padding: 1rem;
}

/* Multiple variants together */
.my-block.dark.compact {
  /* Specific styles for both variants */
}
```

**Usage in content:**
```
| My Block (dark, compact) |
| --- |
| Content here |
```

## Best Practices

### 1. Semantic HTML

```javascript
// Good - Semantic structure
const ul = document.createElement('ul');
const li = document.createElement('li');

// Avoid - Generic divs
const div = document.createElement('div');
div.className = 'fake-list';
```

### 2. Progressive Enhancement

```javascript
export default function decorate(block) {
  // 1. Create base structure (works without JS)
  const button = block.querySelector('a');
  button.textContent = 'Click me';
  
  // 2. Enhance with JavaScript
  button.addEventListener('click', (e) => {
    e.preventDefault();
    // Enhanced behavior
  });
}
```

### 3. Accessibility

```javascript
// Add ARIA attributes
button.setAttribute('aria-label', 'Open navigation menu');
button.setAttribute('aria-expanded', 'false');

// Manage focus
dialog.setAttribute('role', 'dialog');
dialog.setAttribute('aria-modal', 'true');
const firstInput = dialog.querySelector('input');
firstInput.focus();

// Keyboard support
element.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDialog();
  }
});
```

### 4. Performance

```javascript
// Lazy load heavy dependencies
const loadChart = async () => {
  const { Chart } = await import('./chart-library.js');
  return Chart;
};

// Use event delegation
list.addEventListener('click', (e) => {
  if (e.target.matches('button')) {
    handleClick(e.target);
  }
});

// Cache DOM queries
const elements = {
  button: block.querySelector('button'),
  content: block.querySelector('.content'),
  overlay: block.querySelector('.overlay')
};
```

### 5. Error Handling

```javascript
export default async function decorate(block) {
  try {
    const response = await fetch('/data.json');
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    render(block, data);
  } catch (error) {
    console.error('Block error:', error);
    block.innerHTML = '<p>Content unavailable</p>';
  }
}
```

## Testing Your Block

### Local Testing

1. Start dev server: `aem up`
2. Create test content
3. View at `http://localhost:3000`
4. Check browser console for errors

### Browser Console Testing

```javascript
// Test block decoration
const block = document.querySelector('.my-block');
import('/blocks/my-block/my-block.js')
  .then(module => module.default(block));
```

### Debugging

```javascript
export default function decorate(block) {
  console.log('Block element:', block);
  console.log('Block children:', [...block.children]);
  console.log('Block config:', readBlockConfig(block));
  
  // Your code here
}
```

## Common Issues

### Block doesn't load
- Check file naming (kebab-case)
- Verify `export default` is used
- Check browser console for errors

### Styles not applying
- Verify CSS class names match block name
- Check CSS file is in same directory
- Inspect element in DevTools

### Images not showing
- Use `createOptimizedPicture()` helper
- Check image paths
- Verify images load in Network tab

## Next Steps

- [Styling Blocks](./styling-blocks.md) - CSS best practices
- [Working with Universal Editor](./universal-editor.md) - Enable in-context editing
- [Core Utilities API](../reference/core-utilities.md) - Available helper functions
- [Block Reference](../reference/blocks.md) - Study existing blocks
