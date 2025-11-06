# Styling Blocks

This guide covers best practices for styling blocks in AEM Edge Delivery Services.

## CSS Architecture

### Global vs Block Styles

**Global Styles** (`styles/styles.css`)
- CSS custom properties (variables)
- Typography defaults
- Color palette
- Basic resets

**Block Styles** (`blocks/*/block-name.css`)
- Block-specific layout
- Component variants
- Responsive behavior
- Interaction states

### Example Global Styles

```css
/* styles/styles.css */
:root {
  /* Colors */
  --color-primary: #0070f3;
  --color-secondary: #7928ca;
  --color-text: #1a1a1a;
  --color-background: #ffffff;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;
  
  /* Typography */
  --font-family-base: system-ui, -apple-system, sans-serif;
  --font-family-heading: var(--font-family-base);
  --font-size-base: 1rem;
  --line-height-base: 1.6;
}

body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--color-text);
  background: var(--color-background);
}
```

## Block Styling Patterns

### Pattern 1: Basic Block Layout

```css
/* blocks/my-block/my-block.css */
.my-block {
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.my-block-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: var(--spacing-md);
}

.my-block-content {
  font-size: 1.125rem;
  line-height: 1.7;
}
```

### Pattern 2: Grid Layout

```css
.my-block {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .my-block {
    grid-template-columns: 1fr;
  }
}
```

### Pattern 3: Flex Layout

```css
.my-block {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.my-block-image {
  flex: 0 0 40%;
}

.my-block-content {
  flex: 1;
}

@media (max-width: 768px) {
  .my-block {
    flex-direction: column;
  }
  
  .my-block-image {
    flex: 1 1 100%;
  }
}
```

## Responsive Design

### Mobile-First Approach

```css
/* Mobile styles (default) */
.my-block {
  padding: var(--spacing-md);
}

.my-block-item {
  width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
  .my-block {
    padding: var(--spacing-lg);
  }
  
  .my-block-item {
    width: 50%;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .my-block {
    padding: var(--spacing-xl);
  }
  
  .my-block-item {
    width: 33.333%;
  }
}
```

### Container Queries

```css
.my-block {
  container-type: inline-size;
  container-name: block;
}

.my-block-item {
  display: block;
}

@container block (min-width: 600px) {
  .my-block-item {
    display: flex;
    gap: var(--spacing-md);
  }
}
```

## Block Variants

### Color Variants

```css
/* Default */
.my-block {
  background: white;
  color: var(--color-text);
}

/* Dark variant */
.my-block.dark {
  background: var(--color-text);
  color: white;
}

/* Accent variant */
.my-block.accent {
  background: var(--color-primary);
  color: white;
}
```

### Size Variants

```css
/* Default size */
.my-block {
  padding: var(--spacing-lg);
}

/* Compact variant */
.my-block.compact {
  padding: var(--spacing-sm);
}

/* Spacious variant */
.my-block.spacious {
  padding: var(--spacing-xl);
}
```

### Layout Variants

```css
/* Default: horizontal */
.my-block {
  display: flex;
  flex-direction: row;
}

/* Vertical variant */
.my-block.vertical {
  flex-direction: column;
}

/* Centered variant */
.my-block.centered {
  text-align: center;
  align-items: center;
  justify-content: center;
}
```

## Interactive States

### Hover Effects

```css
.my-block-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.my-block-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
```

### Focus States

```css
.my-block button {
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition: outline-color 0.2s ease;
}

.my-block button:focus-visible {
  outline-color: var(--color-primary);
}
```

### Active States

```css
.my-block-tab {
  border-bottom: 2px solid transparent;
}

.my-block-tab.active {
  border-bottom-color: var(--color-primary);
  font-weight: bold;
}
```

## Performance Optimization

### Minimize Reflows

```css
/* Good - GPU-accelerated */
.my-block-slide {
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.my-block-slide.active {
  transform: translateX(-100%);
}

/* Avoid - triggers reflow */
.my-block-slide {
  left: 0;
  transition: left 0.3s ease;
}

.my-block-slide.active {
  left: -100%;
}
```

### Will-Change for Animations

```css
.my-block-animated {
  will-change: transform;
}

.my-block-animated.animating {
  transform: scale(1.1);
}

/* Remove after animation */
.my-block-animated.animation-done {
  will-change: auto;
}
```

### Content-Visibility

```css
.my-block-lazy {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```

## Accessibility

### Color Contrast

```css
/* Ensure sufficient contrast (WCAG AA: 4.5:1) */
.my-block {
  background: #ffffff;
  color: #1a1a1a; /* Contrast ratio: 20:1 */
}

.my-block.dark {
  background: #1a1a1a;
  color: #ffffff; /* Contrast ratio: 20:1 */
}
```

### Focus Indicators

```css
/* Visible focus indicator */
.my-block a:focus-visible,
.my-block button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Never remove outlines without replacement */
/* BAD: .my-block *:focus { outline: none; } */
```

### Screen Reader Only Content

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

## CSS Custom Properties

### Block-Specific Variables

```css
.my-block {
  --block-gap: 1rem;
  --block-radius: 0.5rem;
  --block-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.my-block-item {
  gap: var(--block-gap);
  border-radius: var(--block-radius);
  box-shadow: var(--block-shadow);
}
```

### Theming with Variables

```css
/* Light theme (default) */
.my-block {
  --block-bg: white;
  --block-text: #1a1a1a;
  --block-border: #e0e0e0;
}

/* Dark theme */
.my-block.dark {
  --block-bg: #1a1a1a;
  --block-text: white;
  --block-border: #333;
}

/* Apply variables */
.my-block {
  background: var(--block-bg);
  color: var(--block-text);
  border: 1px solid var(--block-border);
}
```

## Common Patterns

### Card Layout

```css
.my-block-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.my-block-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.my-block-card-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.my-block-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.my-block-card-body {
  padding: 1.5rem;
}
```

### Hero Section

```css
.my-block-hero {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.my-block-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
  z-index: 1;
}

.my-block-hero > * {
  position: relative;
  z-index: 2;
}
```

### Button Styles

```css
.my-block button,
.my-block .button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.my-block button:hover {
  background: var(--color-primary-dark, #0051cc);
}

.my-block button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.my-block button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Debugging Styles

### Browser DevTools

1. Inspect element
2. Check computed styles
3. Verify specificity
4. Test responsive breakpoints

### CSS Validation

```bash
npm run lint:css
```

### Common Issues

**Styles not applying:**
- Check class name matches block name
- Verify CSS file location
- Check specificity conflicts

**Layout issues:**
- Inspect box model in DevTools
- Check for conflicting positioning
- Verify container queries support

## Best Practices

1. **Use CSS custom properties** for reusable values
2. **Mobile-first** responsive design
3. **Minimize specificity** - avoid deep nesting
4. **Performance** - use transforms over position/size
5. **Accessibility** - maintain contrast ratios
6. **Semantic class names** - `.block-item`, not `.box1`
7. **Progressive enhancement** - base layout works without JS

## Next Steps

- [Creating Blocks](./creating-blocks.md) - Build block functionality
- [Performance](../explanation/performance.md) - CSS optimization
- [Block Reference](../reference/blocks.md) - Study existing patterns
