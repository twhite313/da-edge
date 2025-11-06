# Getting Started

This tutorial will guide you through setting up your development environment and creating your first custom block in AEM Edge Delivery Services.

**What you'll learn:**
- Setting up the local development environment
- Understanding the project structure
- Creating a simple custom block
- Testing your block locally

**Prerequisites:**
- Node.js (v18 or higher)
- npm (v8 or higher)
- Git
- Code editor (VS Code recommended)
- Basic knowledge of HTML, CSS, and JavaScript

**Time to complete:** 30 minutes

## Step 1: Clone the Repository

First, clone the repository to your local machine:

```bash
# Clone the repository
git clone https://github.com/twhite313/da-edge.git

# Navigate to the project directory
cd da-edge
```

## Step 2: Install Dependencies

Install the project dependencies:

```bash
# Install npm packages
npm install
```

This installs:
- ESLint for JavaScript linting
- Stylelint for CSS linting
- Husky for git hooks
- Other development tools

## Step 3: Install AEM CLI

The AEM CLI provides a local development server:

```bash
# Install AEM CLI globally
npm install -g @adobe/aem-cli

# Verify installation
aem --version
```

**Note:** If you encounter permission errors, consider using [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to avoid needing sudo for global package installations.

## Step 4: Start the Development Server

Start the local development server:

```bash
# Start AEM CLI
aem up
```

You should see output like:
```
AEM dev server up and running: http://localhost:3000/
```

Keep this terminal open. The server will watch for file changes and reload automatically.

## Step 5: Explore the Project Structure

Open the project in your code editor and explore the structure:

```
da-edge/
├── blocks/           # All custom blocks
│   ├── cards/       # Example: Cards block
│   ├── hero/        # Example: Hero block
│   └── ...
├── scripts/          # Core utilities
│   ├── aem.js       # AEM utility functions
│   └── scripts.js   # Page initialization
├── styles/           # Global styles
│   └── styles.css   # Base styles
├── head.html         # HTML head content
└── fstab.yaml       # Content source config
```

## Step 6: Understand an Existing Block

Let's examine the `cards` block to understand how blocks work:

**View the JavaScript:**
```bash
cat blocks/cards/cards.js
```

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])
    );
  });

  block.replaceChildren(ul);
}
```

**Key observations:**
1. The function is exported as default
2. It receives the block element as a parameter
3. It transforms the DOM structure
4. It optimizes images
5. It uses semantic HTML (ul/li)

## Step 7: Create Your First Block

Let's create a simple "highlight" block that emphasizes important content:

### Create Block Directory

```bash
mkdir -p blocks/highlight
```

### Create the JavaScript

Create `blocks/highlight/highlight.js`:

```javascript
export default function decorate(block) {
  // Get the content from the block
  const content = block.textContent.trim();
  
  // Clear the block
  block.textContent = '';
  
  // Create a wrapper with icon
  const wrapper = document.createElement('div');
  wrapper.className = 'highlight-content';
  
  const icon = document.createElement('span');
  icon.className = 'highlight-icon';
  icon.textContent = '⭐';
  
  const text = document.createElement('p');
  text.textContent = content;
  
  wrapper.append(icon, text);
  block.append(wrapper);
}
```

### Create the CSS

Create `blocks/highlight/highlight.css`:

```css
.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  margin: 2rem 0;
}

.highlight-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.highlight-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.highlight-content p {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.6;
}
```

## Step 8: Test Your Block Locally

To test your block, you need to create a test document.

### Option A: Create a Test HTML File

Create `test-highlight.html` in the project root:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Test Highlight Block</title>
  <link rel="stylesheet" href="/styles/styles.css">
</head>
<body>
  <main>
    <div class="section">
      <div class="highlight block">
        <div>
          <div>This is an important message that will be highlighted!</div>
        </div>
      </div>
    </div>
  </main>
  <script type="module" src="/scripts/scripts.js"></script>
</body>
</html>
```

### Option B: Use Document-Based Testing

1. Create a test document in your content repository (SharePoint/Google Drive)
2. Add a table with your block:
   ```
   | Highlight |
   | --- |
   | This is an important message that will be highlighted! |
   ```
3. Access through your preview URL

### View Your Block

Open your browser to:
- http://localhost:3000/test-highlight.html (Option A)
- http://localhost:3000/your-test-document (Option B)

You should see your highlighted content with the star icon!

## Step 9: Add Block Variants

Let's add support for different highlight styles:

### Update the CSS

Add to `blocks/highlight/highlight.css`:

```css
/* Success variant */
.highlight.success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

/* Warning variant */
.highlight.warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* Info variant */
.highlight.info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
```

### Test Variants

Update your test HTML:

```html
<!-- Success variant -->
<div class="highlight success block">
  <div>
    <div>Success! Your action was completed.</div>
  </div>
</div>

<!-- Warning variant -->
<div class="highlight warning block">
  <div>
    <div>Warning: Please review before proceeding.</div>
  </div>
</div>
```

Or in your document:
```
| Highlight (success) |
| --- |
| Success! Your action was completed. |
```

## Step 10: Lint Your Code

Ensure your code follows the project's style guidelines:

```bash
# Run linters
npm run lint

# Auto-fix issues
npx eslint . --fix
```

## Step 11: Add Your Block to Git

```bash
# Check status
git status

# Add your block files
git add blocks/highlight/

# Commit your changes
git commit -m "Add highlight block"
```

## What You've Learned

✅ How to set up the development environment  
✅ How to start the local development server  
✅ How blocks are structured (JS + CSS)  
✅ How the `decorate()` function works  
✅ How to create a custom block from scratch  
✅ How to add block variants  
✅ How to test blocks locally  
✅ How to lint your code  

## Next Steps

Now that you have the basics down, explore these topics:

1. **More Complex Blocks**
   - [Creating Blocks](../how-to/creating-blocks.md) - Advanced block development
   - [Block Reference](../reference/blocks.md) - See all available blocks

2. **Styling**
   - [Styling Blocks](../how-to/styling-blocks.md) - CSS best practices
   - Global styles in `styles/styles.css`

3. **Core Utilities**
   - [Core Utilities API](../reference/core-utilities.md) - Helper functions
   - [Scripts API](../reference/scripts-api.md) - Page initialization

4. **Universal Editor**
   - [Working with Universal Editor](../how-to/universal-editor.md) - Enable in-context editing
   - [Universal Editor Guide](../../ue/README.md) - Setup and configuration

5. **Architecture**
   - [Architecture Overview](../explanation/architecture.md) - How it all works
   - [Block System](../explanation/block-system.md) - Deep dive into blocks
   - [Performance](../explanation/performance.md) - Optimization techniques

## Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill the process if needed
kill -9 <PID>

# Try again
aem up
```

### Block doesn't load
- Check browser console for errors
- Verify file names match block name (kebab-case)
- Ensure `export default` is used in JavaScript
- Check CSS class names match block name

### Linting errors
```bash
# See what's wrong
npm run lint

# Auto-fix common issues
npx eslint . --fix
```

## Getting Help

- [Documentation Index](../README.md)
- [GitHub Issues](https://github.com/twhite313/da-edge/issues)
- [Contributing Guide](../../CONTRIBUTING.md)
