# Core Utilities API

This reference documents the core utility functions available in `scripts/aem.js`.

## Importing Functions

```javascript
import {
  createOptimizedPicture,
  decorateButtons,
  decorateIcons,
  readBlockConfig,
  toClassName,
  toCamelCase,
  loadCSS,
  loadScript,
  getMetadata,
  buildBlock,
  loadBlock,
  decorateBlock,
  decorateBlocks,
  loadSection,
  loadSections,
  waitForFirstImage,
  loadHeader,
  loadFooter,
  sampleRUM,
  fetchPlaceholders,
} from './aem.js';
```

## Content Manipulation

### `toClassName(name)`

Converts a string to a valid CSS class name.

**Parameters:**
- `name` (string) - The string to convert

**Returns:** (string) - Sanitized class name in kebab-case

**Example:**
```javascript
toClassName('My Block Name'); // 'my-block-name'
toClassName('Hello  World!!!'); // 'hello-world'
toClassName('100% Awesome'); // '100-awesome'
```

**Use case:** Converting author-provided block names to CSS classes.

### `toCamelCase(name)`

Converts a string to camelCase for JavaScript property names.

**Parameters:**
- `name` (string) - The string to convert

**Returns:** (string) - camelCased property name

**Example:**
```javascript
toCamelCase('my-block-name'); // 'myBlockName'
toCamelCase('hero-banner'); // 'heroBanner'
```

**Use case:** Creating JavaScript property names from kebab-case strings.

### `readBlockConfig(block)`

Extracts configuration from a block's key-value pairs.

**Parameters:**
- `block` (Element) - The block element

**Returns:** (Object) - Configuration object

**Example:**

**Content:**
```
| My Block |
| --- |
| Title | My Page Title |
| Columns | 3 |
| URL | https://example.com |
```

**JavaScript:**
```javascript
const config = readBlockConfig(block);
// Returns:
// {
//   title: 'My Page Title',
//   columns: '3',
//   url: 'https://example.com'
// }
```

**Special handling:**
- Links: Extracts `href` attribute(s)
- Images: Extracts `src` attribute(s)
- Multiple values: Returns array

## Image Optimization

### `createOptimizedPicture(src, alt, eager, breakpoints)`

Creates an optimized `<picture>` element with WebP format and responsive sizes.

**Parameters:**
- `src` (string) - Image source URL
- `alt` (string) - Alternative text for accessibility
- `eager` (boolean) - Whether to load eagerly (default: false)
- `breakpoints` (Array) - Array of breakpoint objects

**Returns:** (Element) - `<picture>` element

**Breakpoint object:**
```javascript
{
  media: '(min-width: 600px)', // Media query (optional)
  width: '2000',                // Image width
  format: 'webp'                // Format (optional, default: webp)
}
```

**Examples:**

**Single size:**
```javascript
const picture = createOptimizedPicture(
  '/images/hero.jpg',
  'Hero image',
  false,
  [{ width: '750' }]
);
```

**Responsive sizes:**
```javascript
const picture = createOptimizedPicture(
  '/images/hero.jpg',
  'Hero image',
  true, // Eager load for LCP
  [
    { media: '(min-width: 600px)', width: '2000' },
    { width: '750' }
  ]
);
```

**Generated HTML:**
```html
<picture>
  <source 
    type="image/webp" 
    srcset="/images/hero.jpg?width=2000&format=webp" 
    media="(min-width: 600px)">
  <source 
    type="image/webp" 
    srcset="/images/hero.jpg?width=750&format=webp">
  <img 
    loading="lazy" 
    alt="Hero image" 
    src="/images/hero.jpg?width=750">
</picture>
```

## Decoration Functions

### `decorateButtons(element)`

Converts links into styled buttons based on their text content.

**Parameters:**
- `element` (Element) - Container element to process

**Behavior:**
- Finds `<strong>` or `<em>` tags containing single links
- Adds `.button` class to parent
- Adds `.primary` or `.secondary` class based on emphasis

**Example:**

**Content:**
```html
<p><strong><a href="/page">Click Me</a></strong></p>
<p><em><a href="/page">Learn More</a></em></p>
```

**After decoration:**
```html
<p class="button primary"><a href="/page">Click Me</a></p>
<p class="button secondary"><a href="/page">Learn More</a></p>
```

**Usage:**
```javascript
decorateButtons(block);
```

### `decorateIcons(element, prefix)`

Converts specially formatted spans into icon elements.

**Parameters:**
- `element` (Element) - Container element to process
- `prefix` (string) - Icon prefix (default: '')

**Behavior:**
- Finds `<span class="icon icon-{name}">` elements
- Loads SVG icon from `/icons/{name}.svg`
- Replaces span content with SVG

**Example:**

**HTML:**
```html
<span class="icon icon-search"></span>
```

**After decoration:**
```html
<span class="icon icon-search">
  <svg><!-- SVG content --></svg>
</span>
```

**Usage:**
```javascript
decorateIcons(block);
```

### `decorateIcon(span, prefix, alt)`

Decorates a single icon span.

**Parameters:**
- `span` (Element) - The icon span element
- `prefix` (string) - Icon prefix (default: '')
- `alt` (string) - Alternative text (default: '')

**Returns:** (Element) - The decorated span

**Usage:**
```javascript
const iconSpan = document.createElement('span');
iconSpan.className = 'icon icon-search';
decorateIcon(iconSpan, '', 'Search');
```

## Block Management

### `buildBlock(blockName, content)`

Programmatically creates a block element.

**Parameters:**
- `blockName` (string) - Block name (kebab-case)
- `content` (Array|Element) - Block content

**Returns:** (Element) - Block element

**Example:**

**Simple content:**
```javascript
const block = buildBlock('hero', [
  ['Hero Title'],
  ['Hero description']
]);
```

**With elements:**
```javascript
const img = document.createElement('img');
img.src = '/image.jpg';

const block = buildBlock('cards', [
  [img],
  ['Card title', 'Card description']
]);
```

**Generated HTML:**
```html
<div class="hero block" data-block-name="hero">
  <div><div>Hero Title</div></div>
  <div><div>Hero description</div></div>
</div>
```

### `decorateBlock(block)`

Decorates a block element (adds classes, data attributes).

**Parameters:**
- `block` (Element) - Block element to decorate

**Usage:**
```javascript
const block = document.querySelector('.my-block');
decorateBlock(block);
```

### `decorateBlocks(main)`

Decorates all blocks in a container.

**Parameters:**
- `main` (Element) - Container element

**Usage:**
```javascript
const main = document.querySelector('main');
decorateBlocks(main);
```

### `loadBlock(block)`

Loads a block's CSS and JavaScript, then decorates it.

**Parameters:**
- `block` (Element) - Block element to load

**Returns:** (Promise<void>)

**Example:**
```javascript
const block = document.querySelector('.my-block');
await loadBlock(block);
```

**What it does:**
1. Loads `/blocks/{block-name}/{block-name}.css`
2. Loads `/blocks/{block-name}/{block-name}.js`
3. Calls the block's `decorate()` function
4. Adds `.block` class
5. Removes `.section` class if present

## Section Management

### `loadSection(section, loadCallback)`

Loads a section and its blocks.

**Parameters:**
- `section` (Element) - Section element
- `loadCallback` (Function) - Optional callback called before loading blocks

**Returns:** (Promise<void>)

**Usage:**
```javascript
const section = document.querySelector('.section');
await loadSection(section);
```

### `loadSections(element)`

Loads all sections in a container.

**Parameters:**
- `element` (Element) - Container element (usually `main`)

**Returns:** (Promise<void>)

**Usage:**
```javascript
const main = document.querySelector('main');
await loadSections(main);
```

### `waitForFirstImage(section)`

Waits for the first image in a section to load.

**Parameters:**
- `section` (Element) - Section element

**Returns:** (Promise<void>)

**Usage:**
```javascript
await waitForFirstImage(section);
// First image is now loaded
```

**Use case:** Optimizing Largest Contentful Paint (LCP) metric.

## Header and Footer

### `loadHeader(header)`

Loads and decorates the header block.

**Parameters:**
- `header` (Element) - Header element

**Returns:** (Promise<void>)

**Usage:**
```javascript
const header = document.querySelector('header');
await loadHeader(header);
```

### `loadFooter(footer)`

Loads and decorates the footer block.

**Parameters:**
- `footer` (Element) - Footer element

**Returns:** (Promise<void>)

**Usage:**
```javascript
const footer = document.querySelector('footer');
await loadFooter(footer);
```

## Resource Loading

### `loadCSS(href)`

Loads a CSS file asynchronously.

**Parameters:**
- `href` (string) - URL to the CSS file

**Returns:** (Promise<void>)

**Example:**
```javascript
await loadCSS('/styles/custom.css');
```

**Features:**
- Avoids duplicate loads
- Returns immediately if already loaded
- Resolves when CSS is loaded

### `loadScript(src, attrs)`

Loads a JavaScript file asynchronously.

**Parameters:**
- `src` (string) - URL to the script
- `attrs` (Object) - Optional attributes for the script tag

**Returns:** (Promise<void>)

**Example:**
```javascript
await loadScript('/scripts/analytics.js', {
  type: 'module',
  async: true
});
```

## Metadata

### `getMetadata(name, doc)`

Gets metadata value from the page head.

**Parameters:**
- `name` (string) - Metadata property name
- `doc` (Document) - Document object (default: document)

**Returns:** (string) - Metadata value or empty string

**Example:**

**HTML:**
```html
<head>
  <meta name="description" content="Page description">
  <meta property="og:image" content="/image.jpg">
</head>
```

**JavaScript:**
```javascript
const description = getMetadata('description');
// Returns: 'Page description'

const ogImage = getMetadata('og:image');
// Returns: '/image.jpg'
```

## Placeholders

### `fetchPlaceholders(prefix)`

Fetches placeholder translations for internationalization.

**Parameters:**
- `prefix` (string) - Locale prefix (default: 'default')

**Returns:** (Promise<Object>) - Placeholder key-value pairs

**Example:**
```javascript
const placeholders = await fetchPlaceholders('en');

// Use placeholders
const buttonText = placeholders['button-submit'] || 'Submit';
```

**Placeholder file location:**
`/{prefix}/placeholders.json`

## Analytics

### `sampleRUM(checkpoint, data)`

Sends Real User Monitoring (RUM) data.

**Parameters:**
- `checkpoint` (string) - Checkpoint name
- `data` (Object) - Additional data to send

**Example:**
```javascript
// Track custom checkpoint
sampleRUM('block-loaded', {
  block: 'carousel',
  items: 5
});

// Track user action
sampleRUM('form-submit', {
  formId: 'contact'
});
```

**Built-in checkpoints:**
- `top` - Page load start
- `lazy` - Lazy content loaded
- `cwv` - Core Web Vitals
- `error` - JavaScript errors

## Helper Functions

### `decorateSections(main)`

Wraps content in section divs.

**Parameters:**
- `main` (Element) - Main content element

**Usage:**
```javascript
decorateSections(main);
```

### `wrapTextNodes(element)`

Wraps text nodes in paragraph tags.

**Parameters:**
- `element` (Element) - Element to process

**Usage:**
```javascript
wrapTextNodes(block);
```

### `decorateTemplateAndTheme()`

Applies template and theme classes based on metadata.

**Usage:**
```javascript
decorateTemplateAndTheme();
```

**Looks for:**
- `<meta name="template" content="blog">`
- `<meta name="theme" content="dark">`

**Applies classes to `main`:**
- `.blog-template`
- `.dark-theme`

## Complete Example

```javascript
import {
  createOptimizedPicture,
  readBlockConfig,
  decorateButtons,
  decorateIcons,
  loadCSS,
  sampleRUM,
} from '../../scripts/aem.js';

export default async function decorate(block) {
  // Read configuration
  const config = readBlockConfig(block);
  const columns = config.columns || '3';
  
  // Load custom styles
  await loadCSS('/styles/custom.css');
  
  // Decorate buttons
  decorateButtons(block);
  decorateIcons(block);
  
  // Optimize images
  block.querySelectorAll('img').forEach((img) => {
    const picture = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '750' }]
    );
    img.closest('picture').replaceWith(picture);
  });
  
  // Track analytics
  sampleRUM('block-loaded', {
    block: 'my-block',
    config
  });
}
```

## Next Steps

- [Scripts API](./scripts-api.md) - Page initialization functions
- [Block Reference](./blocks.md) - Available blocks
- [Creating Blocks](../how-to/creating-blocks.md) - Build custom blocks
