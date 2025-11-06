# Scripts API

This reference documents the functions and workflows in `scripts/scripts.js` that initialize and manage the page lifecycle.

## Page Lifecycle

The page loads in three distinct phases:

```
1. loadEager()  → Critical above-the-fold content
2. loadLazy()   → Below-the-fold content
3. loadDelayed() → Analytics and tracking
```

## Initialization

### Automatic Initialization

The scripts automatically initialize when the page loads:

```javascript
// Runs on every page
window.hlx.RUM_GENERATION = 'project-1'; // Custom project ID
document.addEventListener('DOMContentLoaded', async () => {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
});
```

## Loading Functions

### `loadEager(doc)`

Loads critical above-the-fold content immediately.

**Parameters:**
- `doc` (Document) - Document object

**Returns:** (Promise<void>)

**What it loads:**
1. Template and theme decorations
2. Sections decoration
3. Header block
4. First content section (hero/banner)
5. LCP image wait

**Example:**
```javascript
await loadEager(document);
```

**Internal flow:**
```javascript
async function loadEager(doc) {
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateSections(main);
    decorateBlocks(main);
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }
}
```

### `loadLazy(doc)`

Loads below-the-fold content after critical content is visible.

**Parameters:**
- `doc` (Document) - Document object

**Returns:** (Promise<void>)

**What it loads:**
1. Remaining sections
2. Footer
3. Lazy-loaded blocks

**Example:**
```javascript
await loadLazy(document);
```

**Internal flow:**
```javascript
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);
  
  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();
  
  await loadHeader(doc.querySelector('header'));
  await loadFooter(doc.querySelector('footer'));
  
  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}
```

### `loadDelayed()`

Loads non-essential resources that don't impact user experience.

**Returns:** (void)

**What it loads:**
- Analytics scripts
- Tracking pixels
- Cookie consent
- Social media widgets
- Delayed CSS

**Example:**
```javascript
loadDelayed();
```

**Internal flow:**
```javascript
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // Load delayed scripts
  loadCSS(`${window.hlx.codeBasePath}/styles/delayed.css`);
}
```

## Localization

### `getLocale(localesConfig)`

Determines the current locale from the URL path.

**Parameters:**
- `localesConfig` (Object) - Locale configuration object

**Returns:** (Object) - Current locale info

**Example:**

**Configuration:**
```javascript
const locales = {
  '': { lang: 'en' },
  '/de': { lang: 'de' },
  '/fr': { lang: 'fr' },
};

const locale = getLocale(locales);
// On /de/page → { prefix: '/de', lang: 'de' }
// On /page → { prefix: '', lang: 'en' }
```

**Sets `document.documentElement.lang` automatically.**

### `localizeURL(url)`

Localizes a URL based on the current locale.

**Parameters:**
- `url` (URL) - URL object to localize

**Returns:** (URL|null) - Localized URL or null

**Example:**
```javascript
// Current page: /de/products
const url = new URL('/about', window.location.origin);
const localized = localizeURL(url);
// Returns: new URL('/de/about', window.location.origin)
```

## Configuration Access

### Global Configuration

Access the configuration object:

```javascript
const config = window.hlx;

// Available properties:
config.codeBasePath    // Base path for code assets
config.RUM_MASK_URL    // RUM URL masking setting
config.lighthouse      // Lighthouse mode flag
config.locale          // Current locale info
```

### Custom Configuration

Extend configuration in your blocks:

```javascript
// Set custom data
window.hlx.myFeature = {
  enabled: true,
  config: { ... }
};

// Access in other blocks
if (window.hlx.myFeature?.enabled) {
  // Use feature
}
```

## Event Handling

### Custom Events

The scripts dispatch events you can listen to:

#### `rum` Event

Dispatched on every RUM checkpoint:

```javascript
document.addEventListener('rum', (e) => {
  const { checkpoint, data } = e.detail;
  console.log(`RUM checkpoint: ${checkpoint}`, data);
});
```

## URL Parameters

### `?rum=on`

Enables RUM sampling for current session:

```
https://yoursite.com?rum=on
```

### `?lighthouse=on`

Enables Lighthouse optimization mode:

```
https://yoursite.com?lighthouse=on
```

**In code:**
```javascript
if (window.hlx.lighthouse) {
  // Skip animations
  // Optimize for Lighthouse scoring
}
```

## Extending the Scripts

### Adding Custom Loading Logic

#### Option 1: Modify Loading Functions

```javascript
// In your scripts.js
async function loadEager(doc) {
  // ... existing code ...
  
  // Add custom logic
  await loadMyCustomFeature(doc);
}
```

#### Option 2: Use Custom Events

```javascript
// In your block
document.addEventListener('DOMContentLoaded', async () => {
  // Wait for eager content
  await new Promise(resolve => {
    const check = () => {
      if (document.querySelector('.section.loaded')) {
        resolve();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
  
  // Your custom initialization
  initializeMyFeature();
});
```

### Adding Custom Metadata

```javascript
// In your scripts.js
const myCustomMeta = getMetadata('my-feature');
if (myCustomMeta === 'enabled') {
  // Enable feature
}
```

**HTML:**
```html
<head>
  <meta name="my-feature" content="enabled">
</head>
```

## Performance Optimization

### Lazy Loading Strategy

The three-phase loading optimizes Core Web Vitals:

**LCP (Largest Contentful Paint):**
- `loadEager()` loads hero/banner immediately
- `waitForFirstImage()` ensures LCP image loads early

**FID (First Input Delay):**
- Minimal JavaScript in eager phase
- Deferred loading of non-critical scripts

**CLS (Cumulative Layout Shift):**
- CSS loaded before content
- Images have dimensions reserved

### Custom Performance Tracking

```javascript
import { sampleRUM } from './aem.js';

// Track custom metrics
const startTime = performance.now();
await loadMyFeature();
const duration = performance.now() - startTime;

sampleRUM('custom-metric', {
  feature: 'my-feature',
  duration
});
```

## Common Patterns

### Conditional Block Loading

```javascript
// Load block only if needed
const shouldLoadFeature = getMetadata('feature-enabled');

if (shouldLoadFeature === 'true') {
  const block = buildBlock('my-feature', []);
  main.querySelector('.section').append(block);
  await loadBlock(block);
}
```

### Dynamic Content Loading

```javascript
async function loadLazy(doc) {
  // ... existing code ...
  
  // Load dynamic content
  const response = await fetch('/nav.plain.html');
  const html = await response.text();
  doc.querySelector('.nav-container').innerHTML = html;
}
```

### Custom Decorators

```javascript
// Add custom decoration after standard decoration
async function loadEager(doc) {
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  
  if (main) {
    decorateSections(main);
    decorateBlocks(main);
    
    // Custom decoration
    decorateCustomElements(main);
    
    await loadSection(main.querySelector('.section'));
  }
}

function decorateCustomElements(main) {
  // Your custom decorations
  main.querySelectorAll('[data-custom]').forEach(el => {
    // Decorate custom elements
  });
}
```

## Error Handling

### Global Error Handler

```javascript
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // Optional: Send to analytics
  sampleRUM('error', {
    message: e.message,
    source: e.filename
  });
});
```

### Block Loading Errors

```javascript
try {
  await loadBlock(block);
} catch (error) {
  console.error('Failed to load block:', error);
  block.innerHTML = '<p>Content unavailable</p>';
}
```

## Debugging

### Enable Verbose Logging

```javascript
// In browser console
window.hlx.debug = true;

// In your code
if (window.hlx.debug) {
  console.log('Debug info:', data);
}
```

### Monitor Loading Performance

```javascript
// Track loading times
performance.mark('eager-start');
await loadEager(document);
performance.mark('eager-end');
performance.measure('eager-duration', 'eager-start', 'eager-end');

const measures = performance.getEntriesByName('eager-duration');
console.log('Eager load took:', measures[0].duration, 'ms');
```

## Template Variables

### Available in Scripts

```javascript
// Code base path
window.hlx.codeBasePath // e.g., '/scripts'

// Locale info
window.hlx.locale // { prefix: '/de', lang: 'de' }

// RUM instance
window.hlx.rum // RUM tracking object
```

## Complete Example

```javascript
// Custom scripts.js implementation
import {
  decorateTemplateAndTheme,
  decorateSections,
  decorateBlocks,
  loadSection,
  loadSections,
  loadHeader,
  loadFooter,
  loadCSS,
  sampleRUM,
  getMetadata,
} from './aem.js';

// Custom configuration
const config = {
  features: {
    analytics: getMetadata('analytics') === 'true',
    chat: getMetadata('chat-enabled') === 'true',
  }
};

async function loadEager(doc) {
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  
  if (main) {
    decorateSections(main);
    decorateBlocks(main);
    
    // Custom eager loading
    if (config.features.chat) {
      await loadChatWidget();
    }
    
    await loadSection(main.querySelector('.section'));
  }
}

async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);
  await loadHeader(doc.querySelector('header'));
  await loadFooter(doc.querySelector('footer'));
  
  loadCSS(`${window.hlx.codeBasePath}/styles/lazy.css`);
  sampleRUM('lazy');
}

function loadDelayed() {
  // Custom delayed loading
  if (config.features.analytics) {
    loadAnalytics();
  }
  
  loadCSS(`${window.hlx.codeBasePath}/styles/delayed.css`);
}

// Initialize
await loadEager(document);
await loadLazy(document);
loadDelayed();
```

## Next Steps

- [Core Utilities API](./core-utilities.md) - Helper functions
- [Block Reference](./blocks.md) - Available blocks
- [Architecture](../explanation/architecture.md) - How it all works
- [Performance](../explanation/performance.md) - Optimization techniques
