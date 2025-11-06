# Block Reference

This reference documents all available blocks in the project.

## Available Blocks

| Block | Description | Use Case |
|-------|-------------|----------|
| [Accordion](#accordion) | Collapsible content panels | FAQs, long content |
| [Cards](#cards) | Grid of card items | Product listings, features |
| [Carousel](#carousel) | Image/content slider | Image galleries, testimonials |
| [Columns](#columns) | Multi-column layout | Side-by-side content |
| [Embed](#embed) | External content | YouTube, social media |
| [Footer](#footer) | Page footer | Site navigation, links |
| [Form](#form) | Contact forms | Contact, newsletter signup |
| [Fragment](#fragment) | Reusable content | Shared components |
| [Header](#header) | Page header | Site navigation |
| [Hero](#hero) | Large banner section | Landing page hero |
| [Modal](#modal) | Dialog overlays | Popups, lightboxes |
| [Quote](#quote) | Blockquote styling | Testimonials, quotes |
| [Search](#search) | Site search | Content discovery |
| [Table](#table) | Data tables | Pricing, comparisons |
| [Tabs](#tabs) | Tabbed content | Organize related content |
| [Video](#video) | Video player | Video content |

## Accordion

Collapsible panels for organizing content.

### Usage

**Content:**
```
| Accordion |
| --- |
| Question 1 |
| Answer 1 |
| Question 2 |
| Answer 2 |
```

### Features
- Each row alternates between question and answer
- Click to expand/collapse
- Only one panel open at a time (accordion behavior)

### CSS Classes
- `.accordion` - Container
- `.accordion > div` - Item container
- First child - Question (converted to button)
- Second child - Answer (toggles visibility)

## Cards

Grid layout of card items with images and text.

### Usage

**Content:**
```
| Cards |
| --- |
| ![Image 1](image1.jpg) |
| ## Card Title 1 |
| Card description |
| ![Image 2](image2.jpg) |
| ## Card Title 2 |
| Card description |
```

### Features
- Responsive grid layout
- Images automatically optimized
- Semantic HTML (ul/li structure)

### CSS Classes
- `.cards` - Container
- `.cards ul` - List wrapper
- `.cards li` - Individual card
- `.cards-card-image` - Image container
- `.cards-card-body` - Text content

### Variants
```
| Cards (3-up) |     → 3 columns
| Cards (dark) |     → Dark background
```

## Carousel

Image and content slider with navigation controls.

### Usage

**Content:**
```
| Carousel |
| --- |
| ![Slide 1](slide1.jpg) |
| Slide 1 caption |
| ![Slide 2](slide2.jpg) |
| Slide 2 caption |
```

### Features
- Previous/next navigation buttons
- Dot indicators
- Touch/swipe support
- Auto-play option (via variant)
- Keyboard navigation

### CSS Classes
- `.carousel` - Container
- `.carousel-slides` - Slides wrapper
- `.carousel-slide` - Individual slide
- `.carousel-navigation` - Button container
- `.carousel-dots` - Dot indicators

### Variants
```
| Carousel (autoplay) |  → Auto-advance slides
```

### JavaScript API
```javascript
// Access carousel instance
const carousel = block.carousel;

// Methods
carousel.next();      // Next slide
carousel.prev();      // Previous slide
carousel.goTo(index); // Jump to slide
carousel.pause();     // Pause autoplay
carousel.play();      // Resume autoplay
```

## Columns

Multi-column layout for side-by-side content.

### Usage

**Content:**
```
| Columns |
| --- |
| Column 1 content |
| Column 2 content |
| Column 3 content |
```

### Features
- Responsive (stacks on mobile)
- Equal-width columns by default
- Supports any content type

### CSS Classes
- `.columns` - Container
- `.columns > div` - Column wrapper
- `.columns > div > div` - Individual column

### Variants
```
| Columns (2-up) |      → 2 columns
| Columns (3-up) |      → 3 columns (default)
| Columns (4-up) |      → 4 columns
```

## Embed

Embed external content (YouTube, social media, etc.).

### Usage

**Content:**
```
| Embed |
| --- |
| https://www.youtube.com/watch?v=VIDEO_ID |
```

### Supported Platforms
- YouTube
- Vimeo
- Twitter/X
- Instagram
- Facebook
- TikTok
- Spotify
- SoundCloud

### Features
- Lazy loading (loads on scroll)
- Responsive aspect ratios
- Privacy-friendly (no load until visible)
- Click-to-load consent

### CSS Classes
- `.embed` - Container
- `.embed-placeholder` - Loading placeholder
- `.embed-${platform}` - Platform-specific class

## Footer

Site footer with navigation and links.

### Usage

**Content:**
```
| Footer |
| --- |
| [About](about) |
| [Contact](contact) |
| [Privacy](privacy) |
```

### Features
- Multi-column layout
- Social media icons
- Copyright notice
- Responsive design

### CSS Classes
- `.footer` - Container
- `.footer-wrapper` - Content wrapper
- `.footer-column` - Column container

## Form

Contact and submission forms.

### Usage

**Content:**
```
| Form |
| --- |
| https://main--site--owner.hlx.page/forms/contact |
```

### Features
- Field types: text, email, tel, textarea, select, radio, checkbox
- Client-side validation
- Submit handling
- Thank you message
- Error handling

### CSS Classes
- `.form` - Container
- `.form-field-wrapper` - Field container
- `.form-label` - Field label
- `.form-input` - Input element
- `.form-button-container` - Button wrapper

### Field Configuration
Forms are defined in a separate document with structure:
```
| Field Label | Field Type | Required |
| --- | --- | --- |
| Name | text | true |
| Email | email | true |
| Message | textarea | false |
| Submit | submit | |
```

## Fragment

Include reusable content from other pages.

### Usage

**Content:**
```
| Fragment |
| --- |
| /fragments/call-to-action |
```

### Features
- Load content from any page
- Caching for performance
- Nested fragments supported
- Blocks in fragments work normally

### CSS Classes
- `.fragment` - Container (replaced with fragment content)

## Header

Site header with navigation.

### Usage

**Content:**
```
| Header |
| --- |
| [Home](/) |
| [About](/about) |
| [Contact](/contact) |
```

### Features
- Logo/branding area
- Main navigation
- Mobile hamburger menu
- Search integration
- Sticky header option

### CSS Classes
- `.header` - Container
- `.header-wrapper` - Content wrapper
- `.nav` - Navigation container
- `.nav-brand` - Logo area
- `.nav-sections` - Menu items
- `.nav-hamburger` - Mobile toggle

### Variants
```
| Header (sticky) |    → Fixed position on scroll
| Header (dark) |      → Dark background
```

## Hero

Large banner section for landing pages.

### Usage

**Content:**
```
| Hero |
| --- |
| # Hero Title |
| Hero description text |
| ![Hero image](hero.jpg) |
```

### Features
- Full-width background
- Text overlay
- Call-to-action buttons
- Responsive typography

### CSS Classes
- `.hero` - Container
- `.hero > div > div` - Content wrapper

### Variants
```
| Hero (centered) |    → Centered text
| Hero (overlay) |     → Dark overlay on image
```

## Modal

Dialog overlay for popups and lightboxes.

### Usage

**JavaScript:**
```javascript
import { createModal } from './modal.js';

const modal = await createModal('modal-id');
modal.showModal();
```

### Features
- Backdrop overlay
- Close button
- Escape key support
- Focus trap
- Accessible (ARIA labels)

### CSS Classes
- `.modal` - Dialog element
- `.modal-content` - Content wrapper
- `.modal-close` - Close button

## Quote

Styled blockquotes for testimonials.

### Usage

**Content:**
```
| Quote |
| --- |
| The product exceeded our expectations. |
| John Doe, CEO |
```

### Features
- Citation support
- Author attribution
- Quotation marks (via CSS)

### CSS Classes
- `.quote` - Container
- `.quote p:first-child` - Quote text
- `.quote-author` - Author attribution

### Variants
```
| Quote (large) |      → Larger text
| Quote (centered) |   → Centered layout
```

## Search

Site-wide search functionality.

### Usage

**Content:**
```
| Search |
| --- |
```

### Features
- Instant results
- Keyboard navigation
- Highlighting
- Recent searches
- Search suggestions

### CSS Classes
- `.search` - Container
- `.search-input` - Input field
- `.search-results` - Results container
- `.search-result` - Individual result

## Table

Styled data tables.

### Usage

**Content:**
```
| Table |
| --- |
| Plan | Price | Features |
| Basic | $10 | 1 user |
| Pro | $20 | 5 users |
```

### Features
- Responsive (horizontal scroll on mobile)
- Header row styling
- Zebra striping option
- Sort support (via variant)

### CSS Classes
- `.table` - Container
- `.table table` - Table element
- `.table th` - Header cell
- `.table td` - Data cell

### Variants
```
| Table (striped) |    → Alternating row colors
| Table (sortable) |   → Sortable columns
```

## Tabs

Tabbed content interface.

### Usage

**Content:**
```
| Tabs |
| --- |
| Tab 1 Title |
| Tab 1 content |
| Tab 2 Title |
| Tab 2 content |
```

### Features
- Click to switch tabs
- Keyboard navigation (arrows)
- Deep linking support
- Accessible (ARIA roles)

### CSS Classes
- `.tabs` - Container
- `.tabs-list` - Tab buttons container
- `.tabs-button` - Individual tab button
- `.tabs-panel` - Tab content panel

## Video

Video player with custom controls.

### Usage

**Content:**
```
| Video |
| --- |
| https://example.com/video.mp4 |
```

### Features
- Custom controls
- Poster image support
- Autoplay option
- Lazy loading
- Supports: MP4, WebM, YouTube, Vimeo

### CSS Classes
- `.video` - Container
- `.video video` - Video element
- `.video-controls` - Controls container
- `.video-play-button` - Play/pause button

### Variants
```
| Video (autoplay) |   → Auto-play on load
| Video (loop) |       → Loop playback
| Video (muted) |      → Start muted
```

## Creating Custom Blocks

See the [Creating Blocks](../how-to/creating-blocks.md) guide for instructions on building custom blocks.

## Block Development Patterns

### Simple Content Block
- Transform content structure
- Apply styles
- No interactivity needed

### Interactive Block
- Add event listeners
- Manage state
- Keyboard support
- Accessibility features

### Data-Loading Block
- Fetch external data
- Handle loading states
- Error handling
- Cache responses

### Container Block
- Support nested blocks
- Coordinate child blocks
- Pass data to children

## Next Steps

- [Creating Blocks](../how-to/creating-blocks.md) - Build custom blocks
- [Styling Blocks](../how-to/styling-blocks.md) - Style best practices
- [Core Utilities API](./core-utilities.md) - Helper functions
- [Block System](../explanation/block-system.md) - How blocks work
