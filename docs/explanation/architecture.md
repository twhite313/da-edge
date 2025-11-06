# Architecture Overview

This document explains the architecture of AEM Edge Delivery Services and how this project is structured.

## What is AEM Edge Delivery Services?

AEM Edge Delivery Services is Adobe's modern approach to building high-performance websites. It combines:

- **Document-based authoring** - Content authors work in familiar tools (Microsoft Word, Google Docs)
- **Code-based development** - Developers build with standard web technologies (HTML, CSS, JavaScript)
- **Edge delivery** - Content is served from a CDN for maximum performance

## Architecture Principles

### 1. Content Separation

Content and code are completely separate:

- **Content** lives in documents (Microsoft Word, Google Docs, SharePoint)
- **Code** lives in this GitHub repository
- **Rendering** happens at the edge (CDN)

### 2. Block-Based Design

The page is composed of reusable blocks:

```
Page
├── Header Block
├── Hero Block
├── Cards Block
├── Columns Block
└── Footer Block
```

Each block is self-contained with its own:
- JavaScript (`block.js`)
- CSS (`block.css`)
- HTML structure (generated from content)

### 3. Progressive Enhancement

Pages work without JavaScript and enhance when JavaScript loads:

1. **Base HTML** - Server-rendered semantic HTML
2. **Base CSS** - Loads immediately for styling
3. **Block CSS** - Loads per-block as needed
4. **Block JS** - Enhances interactivity

## Project Structure

```
da-edge/
├── blocks/              # Reusable blocks
│   ├── accordion/
│   ├── cards/
│   ├── carousel/
│   └── ...
├── scripts/             # Core utilities
│   ├── aem.js          # AEM utility functions
│   ├── scripts.js      # Page initialization
│   └── ...
├── styles/              # Global styles
├── ue/                  # Universal Editor config
└── docs/                # Documentation
```

## Request Flow

### 1. Content Request

```
User Request
    ↓
CDN (Edge)
    ↓
Content Transformation
    ↓
HTML Response
```

### 2. Page Loading Sequence

```javascript
// 1. Load base HTML & CSS
// 2. Load scripts.js
loadEager() {
  // Load critical blocks (header, first section)
}

// 3. Load remaining blocks
loadLazy() {
  // Load below-the-fold blocks
}

// 4. Load delayed resources
loadDelayed() {
  // Load analytics, tracking, etc.
}
```

## Block Lifecycle

### 1. Block Definition (Content)

Authors create blocks in documents:

```
| Cards |
| --- |
| Card 1 content |
| Card 2 content |
```

### 2. Block Decoration (Runtime)

The framework:
1. Identifies block tables in content
2. Converts to semantic HTML
3. Applies block-specific CSS class
4. Calls block's `decorate()` function

### 3. Block Enhancement (JavaScript)

```javascript
// blocks/cards/cards.js
export default function decorate(block) {
  // Transform the block's DOM
  // Add interactivity
  // Load images
}
```

## Universal Editor Integration

Universal Editor provides in-context editing:

```
Content Author
    ↓
Universal Editor UI
    ↓
Component Models (JSON)
    ↓
Block Configuration
    ↓
Live Preview
```

Configuration files:
- `component-definitions.json` - Enables blocks in UE
- `component-models.json` - Defines editable fields
- `component-filters.json` - Handles nested content

## Performance Strategy

### 1. Lazy Loading

- Only critical content loads immediately
- Below-the-fold content loads on demand
- Images lazy load with intersection observer

### 2. Minimal JavaScript

- No framework overhead
- Vanilla JavaScript only
- Code splitting per block

### 3. Edge Caching

- Content cached at CDN edge
- Instant page loads globally
- Cache invalidation on publish

## Development Workflow

```
1. Author creates content → Document (Word/Docs)
2. Developer builds blocks → GitHub
3. Content publishes → Edge cache
4. User requests page → CDN serves instantly
```

## Key Concepts

### Content Repository

- Content stored in SharePoint or Google Drive
- No database required
- Authors use familiar tools

### Code Repository

- This GitHub repository
- Standard web development workflow
- Git-based version control

### Edge Delivery

- Cloudflare Workers transform content
- Fastly CDN caches output
- Global distribution

## Technology Stack

- **JavaScript** - ES6+ modules, no build step required
- **CSS** - Modern CSS with custom properties
- **HTML** - Semantic, accessible markup
- **CDN** - Cloudflare/Fastly edge network
- **Content** - Microsoft 365/Google Workspace

## Benefits

1. **Performance** - Sub-second page loads globally
2. **Simplicity** - No complex build tools or frameworks
3. **Scalability** - Edge caching handles any traffic
4. **Author Experience** - Familiar document-based authoring
5. **Developer Experience** - Standard web development

## Next Steps

- [Block System](./block-system.md) - Deep dive into blocks
- [Performance Considerations](./performance.md) - Optimization techniques
- [Creating Blocks](../how-to/creating-blocks.md) - Build your first block
