# Working with Universal Editor

This guide explains how to configure blocks for use with Adobe's Universal Editor, enabling in-context editing for content authors.

## Prerequisites

- Completed [Getting Started](../tutorials/getting-started.md) tutorial
- Understanding of [Block System](../explanation/block-system.md)
- A Universal Editor-enabled AEM instance
- Your block working locally

## What is Universal Editor?

Universal Editor is Adobe's in-context editing experience that allows content authors to:
- Edit content directly on the page
- See changes in real-time
- Configure block properties visually
- No need to switch to a separate authoring interface

## Configuration Files

Three JSON files define Universal Editor integration:

### 1. Component Definitions

**File:** `ue/models/blocks/my-block/component-definition.json`

Enables your block in Universal Editor.

```json
{
  "groups": [
    {
      "title": "My Block",
      "id": "my-block",
      "components": [
        {
          "title": "My Block",
          "id": "my-block",
          "plugins": {
            "da": {
              "initialContent": "<table><tr><th>My Block</th></tr><tr><td>Default content</td></tr></table>"
            }
          }
        }
      ]
    }
  ]
}
```

### 2. Component Models

**File:** `ue/models/blocks/my-block/component-model.json`

Defines editable fields in the properties panel.

```json
{
  "id": "my-block",
  "fields": [
    {
      "component": "text",
      "name": "title",
      "label": "Title",
      "valueType": "string"
    },
    {
      "component": "richtext",
      "name": "description",
      "label": "Description",
      "valueType": "string"
    },
    {
      "component": "reference",
      "name": "image",
      "label": "Image",
      "valueType": "string"
    }
  ]
}
```

### 3. Component Filters

**File:** `ue/models/blocks/my-block/component-filters.json`

Defines how nested content is handled (for container blocks).

```json
{
  "id": "my-block",
  "components": []
}
```

For non-container blocks, use an empty array.

## Step-by-Step Setup

### Step 1: Create Your Block

First, create a working block:

```javascript
// blocks/my-block/my-block.js
export default function decorate(block) {
  // Your block logic
}
```

```css
/* blocks/my-block/my-block.css */
.my-block {
  /* Your styles */
}
```

### Step 2: Test Locally

```bash
aem up
# Verify block works at http://localhost:3000
```

### Step 3: Add Block to a Page

Using the document editor, add your block to a test page:

```
| My Block |
| --- |
| Test content |
```

### Step 4: Inspect in Universal Editor

1. Open the page in Universal Editor
2. Open browser DevTools → Network tab
3. Look for `/details` network call
4. Inspect the response JSON to understand the block structure

### Step 5: Create Configuration Files

Create the directory structure:

```bash
mkdir -p ue/models/blocks/my-block
```

Create the three JSON files based on the `/details` inspection.

### Step 6: Add to Section Filter

Edit `ue/models/section.json` to include your block:

```json
{
  "id": "section",
  "components": [
    "my-block",
    "other-existing-blocks"
  ]
}
```

### Step 7: Build Configuration

Build the JSON configuration files:

```bash
npm run build:json
```

This merges your block's configuration into the root files:
- `component-definitions.json`
- `component-models.json`
- `component-filters.json`

### Step 8: Test in Universal Editor

1. Publish your changes
2. Open the page in Universal Editor
3. Your block should appear in the component list
4. Properties panel should show your defined fields

## Field Types

### Text Field

Simple single-line text input.

```json
{
  "component": "text",
  "name": "title",
  "label": "Title",
  "valueType": "string",
  "required": true
}
```

### Rich Text Field

Multi-line formatted text editor.

```json
{
  "component": "richtext",
  "name": "description",
  "label": "Description",
  "valueType": "string"
}
```

### Reference Field

Select images or documents.

```json
{
  "component": "reference",
  "name": "image",
  "label": "Image",
  "valueType": "string"
}
```

### Select Field

Dropdown with predefined options.

```json
{
  "component": "select",
  "name": "variant",
  "label": "Style",
  "valueType": "string",
  "options": [
    { "name": "Default", "value": "" },
    { "name": "Dark", "value": "dark" },
    { "name": "Light", "value": "light" }
  ]
}
```

### Boolean Field

Checkbox for true/false values.

```json
{
  "component": "boolean",
  "name": "showImage",
  "label": "Show Image",
  "valueType": "boolean",
  "defaultValue": true
}
```

### Number Field

Numeric input.

```json
{
  "component": "number",
  "name": "columns",
  "label": "Number of Columns",
  "valueType": "number",
  "defaultValue": 3,
  "min": 1,
  "max": 6
}
```

## Block Options

For block variants (classes), use special field names:

### Single Option

```json
{
  "component": "select",
  "name": "classes",
  "label": "Style",
  "valueType": "string",
  "options": [
    { "name": "Default", "value": "" },
    { "name": "Dark", "value": "dark" },
    { "name": "Centered", "value": "centered" }
  ]
}
```

### Multiple Options

For multiple class toggles:

```json
{
  "component": "select",
  "name": "classes_style",
  "label": "Style",
  "valueType": "string",
  "options": [
    { "name": "Default", "value": "" },
    { "name": "Dark", "value": "dark" },
    { "name": "Light", "value": "light" }
  ]
},
{
  "component": "select",
  "name": "classes_layout",
  "label": "Layout",
  "valueType": "string",
  "options": [
    { "name": "Default", "value": "" },
    { "name": "Centered", "value": "centered" },
    { "name": "Wide", "value": "wide" }
  ]
}
```

This creates: `<div class="my-block dark centered">`

## Container Blocks

For blocks that contain other blocks (like accordion, tabs):

### Component Filter Example

```json
{
  "id": "accordion",
  "components": [
    "text",
    "image",
    "teaser"
  ]
}
```

### JavaScript Handling

```javascript
export default function decorate(block) {
  // Each child is a container for nested blocks
  [...block.children].forEach((item) => {
    const content = item.querySelector('.accordion-content');
    // Nested blocks are already decorated by the framework
  });
}
```

## CSS Selectors

Link fields to specific parts of your block using CSS selectors:

```json
{
  "component": "text",
  "name": "title",
  "label": "Title",
  "valueType": "string",
  "selector": ".my-block-title"
}
```

Your block must have this structure:

```javascript
export default function decorate(block) {
  const title = document.createElement('h2');
  title.className = 'my-block-title';
  // Universal Editor will target this element
}
```

## Advanced Configuration

### Conditional Fields

Show fields based on other field values:

```json
{
  "component": "boolean",
  "name": "showImage",
  "label": "Show Image"
},
{
  "component": "reference",
  "name": "image",
  "label": "Image",
  "condition": "model.showImage === true"
}
```

### Field Validation

```json
{
  "component": "text",
  "name": "email",
  "label": "Email",
  "valueType": "string",
  "validation": {
    "type": "email"
  }
}
```

### Multi-Value Fields

```json
{
  "component": "multiselect",
  "name": "tags",
  "label": "Tags",
  "valueType": "string[]",
  "options": [
    { "name": "News", "value": "news" },
    { "name": "Blog", "value": "blog" },
    { "name": "Tutorial", "value": "tutorial" }
  ]
}
```

## Testing Universal Editor Integration

### Local Testing

1. Use `npm run build:json` after configuration changes
2. Check generated files in project root
3. Validate JSON syntax
4. Test field types and options

### Universal Editor Testing

1. Open page in Universal Editor
2. Add your block to the page
3. Verify all fields appear in properties panel
4. Test field interactions
5. Verify changes reflect immediately

### Troubleshooting

**Block doesn't appear:**
- Check `component-definitions.json` includes your block
- Verify block ID matches file names
- Check `section.json` includes your block

**Fields not editable:**
- Verify CSS selectors match your HTML structure
- Check `component-models.json` syntax
- Inspect `/details` call for correct structure

**Changes don't persist:**
- Verify field names match content structure
- Check valueType is correct
- Test with simpler field types first

## Complete Example

### Block JavaScript

```javascript
// blocks/feature/feature.js
export default function decorate(block) {
  const title = block.children[0]?.children[0];
  const description = block.children[1]?.children[0];
  const image = block.children[2]?.querySelector('picture');
  
  if (title) title.className = 'feature-title';
  if (description) description.className = 'feature-description';
  if (image) image.parentElement.className = 'feature-image';
}
```

### Component Definition

```json
{
  "groups": [
    {
      "title": "Content",
      "id": "content",
      "components": [
        {
          "title": "Feature",
          "id": "feature",
          "plugins": {
            "da": {
              "initialContent": "<table><tr><th>Feature</th></tr><tr><td>Title</td></tr><tr><td>Description</td></tr><tr><td>![](image.jpg)</td></tr></table>"
            }
          }
        }
      ]
    }
  ]
}
```

### Component Model

```json
{
  "id": "feature",
  "fields": [
    {
      "component": "text",
      "name": "title",
      "label": "Title",
      "valueType": "string",
      "selector": ".feature-title"
    },
    {
      "component": "richtext",
      "name": "description",
      "label": "Description",
      "valueType": "string",
      "selector": ".feature-description"
    },
    {
      "component": "reference",
      "name": "image",
      "label": "Image",
      "valueType": "string"
    },
    {
      "component": "select",
      "name": "classes",
      "label": "Style",
      "valueType": "string",
      "options": [
        { "name": "Default", "value": "" },
        { "name": "Dark", "value": "dark" },
        { "name": "Highlighted", "value": "highlighted" }
      ]
    }
  ]
}
```

### Component Filters

```json
{
  "id": "feature",
  "components": []
}
```

## Next Steps

- [Universal Editor Documentation](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/field-types) - Official field types reference
- [Universal Editor Guide](../../ue/README.md) - Project-specific setup
- [Creating Blocks](./creating-blocks.md) - Build block functionality
- [Block Reference](../reference/blocks.md) - Study existing UE configurations
