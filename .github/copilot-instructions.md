# Adobe Document Authoring (AEM Edge Delivery) Development Guide

## Architecture Overview

This is an **Adobe Document Authoring (AEM Edge Delivery Services)** project that uses a **document-first authoring approach**:

- **Document-based content creation** using Adobe content bus
- **Franklin/Helix publishing pipeline** for high-performance delivery
- **Vanilla JavaScript blocks** for interactive components
- **CSS-first styling** with progressive enhancement
- **Edge-optimized delivery** with automatic performance optimization

### Project Structure

```
da-edge/
├── blocks/                 # Interactive component blocks
│   ├── header/            # Site header with navigation
│   ├── hero/              # Hero banner component
│   ├── cards/             # Card layout blocks
│   ├── footer/            # Site footer
│   └── [block-name]/      # Additional blocks
├── scripts/               # Core JavaScript functionality
│   ├── scripts.js         # Main initialization and utilities
│   ├── aem.js            # AEM Edge Delivery core functions
│   └── delayed.js        # Non-critical functionality
├── styles/               # Global CSS and fonts
│   ├── styles.css        # Core site styles
│   ├── fonts.css         # Web font definitions
│   └── lazy-styles.css   # Non-critical styles
├── tools/                # Development and authoring tools
└── fstab.yaml           # Content source configuration
```

## Development Workflow

### Local Development Setup

1. **Install Sidekick**: [Browser extension](https://chromewebstore.google.com/detail/aem-sidekick/igkmdomcgoebiipaifhmpfjhbjccggml) for AEM content authoring
2. **Install dependencies**: `npm install -g @adobe/aem-cli`
3. **Start development server**: `aem up` 
4. **Preview locally**: Visit `http://localhost:3000`
5. **Live reload**: Changes auto-refresh in browser

### Publishing Pipeline

- **Preview environment**: `*.aem.page` - Shows latest authored content
- **Live environment**: `*.aem.live` - Published content only
- **Sidekick**: Browser extension for preview/publish workflow

### Content Authoring Workflow

1. **Create content** in da.live > [project]
2. **Use Sidekick** to preview changes (*.aem.page)
3. **Publish content** via Sidekick to go live (*.aem.live)
4. **Code changes** deploy automatically via GitHub

## Block Development Patterns

### Block Structure

Each block follows a consistent pattern:

```
blocks/block-name/
├── block-name.js      # Block functionality and decoration
└── block-name.css     # Block-specific styles
```

### Block JavaScript Pattern

```javascript
export default function decorate(block) {
  // Transform the authored table structure into rich HTML
  const rows = [...block.children];
  
  rows.forEach((row) => {
    const cells = [...row.children];
    // Process each cell and transform content
    cells.forEach((cell) => {
      // Add classes, restructure DOM, attach event listeners
      cell.classList.add('block-element');
    });
  });
  
  // Add dynamic behavior
  block.addEventListener('click', handleClick);
}
```

### CSS Architecture

- **Block scoping**: All styles prefixed with `.block-name`
- **BEM naming**: `.block-name__element--modifier` for internal elements
- **Mobile-first**: Use `min-width` media queries exclusively
- **CSS custom properties**: Leverage CSS variables for theming
- **Performance-first**: Critical styles inline, non-critical loaded lazily

```css
.hero {
  /* Block container styles */
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 2rem 1rem;
}

.hero__title {
  /* BEM element naming */
  font-size: 2.5rem;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .hero {
    grid-template-columns: 1fr 1fr;
    padding: 4rem 2rem;
  }
}
```

## Document Authoring Patterns

### Content Structure in Documents

**Tables as Blocks**: The first row defines the block type:

```
| Hero |
|------|
| # Welcome to Our Site |
| ![Hero Image](image.jpg) |
| Get started today |
```

**Metadata Blocks**: Configure page-level settings:

```
| Metadata |
|----------|
| Title | Page Title |
| Description | SEO description |
| Keywords | keyword1, keyword2 |
```

**Fragment Inclusion**: Reuse content across pages:

```
| Fragment |
|----------|
| /nav |
```

### Content Fragments

- **Navigation**: `/nav` document defines site navigation
- **Footer**: `/footer` document for site footer content  
- **Localized fragments**: `/es/nav`, `/de/nav` for international sites

## Internationalization System

### Locale Configuration

Located in `scripts/scripts.js`:

```javascript
const locales = {
  '': { lang: 'en', label: 'English' },        // Root = English (default)
  '/de': { lang: 'de', label: 'Deutsch' },     // German
  '/es': { lang: 'es', label: 'Español' },     // Spanish  
  '/fr': { lang: 'fr', label: 'Français' },    // French
  '/ja': { lang: 'ja', label: '日本語' },       // Japanese
  '/zh': { lang: 'zh', label: '中文' },         // Chinese
};
```

### Localization Features

- **Path-based locale detection**: `/de/about`, `/es/products`
- **Automatic link localization**: Internal links maintain locale context
- **Localized navigation**: Each locale loads its own nav fragment
- **Language switcher ready**: Infrastructure supports language switching UI

### Implementation Pattern

```javascript
export function getLocale(localesConfig) {
  const { pathname } = window.location;
  const matches = Object.keys(localesConfig).filter(
    (locale) => pathname === locale || pathname.startsWith(`${locale}/`)
  );
  const sorted = matches.toSorted((a, b) => b.length - a.length);
  const prefix = getMetadata('locale') || sorted[0] || '';
  
  if (localesConfig[prefix]?.lang) {
    document.documentElement.lang = localesConfig[prefix].lang;
  }
  
  return { prefix, ...localesConfig[prefix] };
}
```

## Performance Optimization

### Core Web Vitals Focus

- **Largest Contentful Paint (LCP)**: Images optimized, fonts preloaded
- **Cumulative Layout Shift (CLS)**: Proper image sizing, stable layouts
- **First Input Delay (FID)**: Minimal JavaScript blocking, progressive enhancement

### Loading Strategy

```javascript
// scripts/scripts.js - Three-phase loading
async function loadEager(doc) {
  // Critical path: LCP content
  decorateTemplateAndTheme();
  decorateMain(main);
  await loadSection(main.querySelector('.section'), waitForFirstImage);
}

async function loadLazy(doc) {
  // Non-critical: header, footer, additional sections
  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));
  await loadSections(main);
}

function loadDelayed() {
  // Analytics, tracking, non-essential features
  window.setTimeout(() => import('./delayed.js'), 3000);
}
```

### Image Optimization

- **Automatic WebP conversion**: Images served in modern formats
- **Responsive images**: Proper `srcset` and `sizes` attributes
- **Lazy loading**: Images load as they enter viewport
- **Critical image prioritization**: LCP images load immediately

## Code Standards

### JavaScript Patterns

- **ES6+ modules**: Use modern JavaScript features
- **Progressive enhancement**: Content works without JavaScript
- **Event delegation**: Efficient event handling
- **Async/await**: Clean asynchronous code patterns

```javascript
// Good: Progressive enhancement
export default function decorate(block) {
  // Base functionality works without JS
  const button = block.querySelector('button');
  
  // Enhanced functionality with JS
  if (button) {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const module = await import('./enhanced-behavior.js');
      module.handleClick(e);
    });
  }
}
```

### CSS Best Practices

- **CSS logical properties**: Use `inline-start`, `block-end` for i18n
- **Container queries**: Where supported for responsive components
- **Custom properties**: Consistent theming and dark mode support
- **Minimal specificity**: Avoid deep nesting and `!important`

### Accessibility Standards

- **WCAG 2.2 AA compliance**: Target level AA conformance
- **Semantic HTML first**: Use appropriate elements before ARIA
- **Focus management**: Logical tab order and visible focus states  
- **Color contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Alt text**: Descriptive image alternative text

## Tools and Development

### AEM Sidekick

Browser extension for content authors:

- **Preview**: See changes on *.aem.page before publishing
- **Publish**: Make content live on *.aem.live
- **Clear Cache**: Force refresh of cached content
- **Bulk Operations**: Publish multiple pages simultaneously

### Development Tools

- **ESLint**: Code quality and consistency checking
- **Stylelint**: CSS linting and formatting
- **Lighthouse**: Performance and accessibility auditing
- **GitHub Actions**: Automated testing and deployment

### Content Source Configuration

`fstab.yaml` defines content sources:

```yaml
mountpoints:
  /:
    url: https://content.da.live/[org]/[site]/
    type: markup
```

## Testing Strategy

### Performance Testing
- **Core Web Vitals monitoring**: Regular Lighthouse audits
- **Real User Monitoring (RUM)**: Adobe Helix RUM integration
- **Network throttling**: Test on slow connections
- **Device testing**: Various screen sizes and capabilities

### Content Testing
- **Progressive authoring**: Empty → minimal → maximum content scenarios
- **Cross-browser**: Chrome, Firefox, Safari, Edge latest versions
- **Accessibility**: Screen reader and keyboard navigation testing
- **Internationalization**: Test all supported locales

### Block Testing
- **Isolation testing**: Each block works independently
- **Multiple instances**: Support 0-∞ block instances per page
- **Content variations**: Test with different content structures
- **Responsive behavior**: All breakpoints and orientations

## Deployment and Environments

### Environment URLs
- **Development**: Local `http://localhost:3000`
- **Staging**: `https://[branch-name]--da-edge--[site].aem.page`
- **Preview**: `https://main--da-edge--[site].aem.page`
- **Production**: `https://main--da-edge--[site].aem.live`

### Git Workflow
- **Feature branches**: Create from `main` for new features
- **Pull requests**: Code review before merging
- **Automatic deployment**: Main branch auto-deploys to production
- **Rollback capability**: Easy revert via GitHub

### Content Publishing
- **Document changes**: Use Sidekick to preview and publish
- **Code changes**: Automatic deployment via GitHub integration
- **Cache management**: Automatic cache invalidation on publish
- **Global content**: Header/footer fragments publish independently

## Common Commands

- **Start development**: `aem up`
- **Lint JavaScript**: `npm run lint:js`
- **Lint CSS**: `npm run lint:css`  
- **Build for production**: `npm run build`
- **Test performance**: `npm run test:lighthouse`

## Essential Files

- **`scripts/scripts.js`**: Core site functionality and configuration
- **`scripts/aem.js`**: AEM Edge Delivery Services utilities
- **`styles/styles.css`**: Global site styles and CSS custom properties
- **`fstab.yaml`**: Content source mounting configuration
- **`package.json`**: Dependencies and build scripts
- **`.eslintrc.js`**: JavaScript code quality rules