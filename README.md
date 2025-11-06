# FeDX 

This project provides a foundation for starting an AEM Edge Delivery Services project. It includes many common blocks and features a project might need.

This is just a sample/test/playground for Adobe Edge Delivery / Document Authoring. 

## URLs

https://main--da-edge--twhite313.aem.page<br>
https://main--da-edge--twhite313.aem.live

## DA compatible

This specific repo has been _slightly_ modified to be compatible with DA's live preview.

## Documentation

Comprehensive developer documentation is available in the [`/docs`](./docs) directory:

- **[Getting Started Tutorial](./docs/tutorials/getting-started.md)** - Set up your environment and create your first block
- **[How-to Guides](./docs/how-to/)** - Step-by-step guides for common tasks
- **[API Reference](./docs/reference/)** - Complete API documentation for utilities and blocks
- **[Architecture & Concepts](./docs/explanation/)** - Understanding how the system works

Quick links:
- [Creating Blocks](./docs/how-to/creating-blocks.md)
- [Styling Blocks](./docs/how-to/styling-blocks.md)
- [Core Utilities API](./docs/reference/core-utilities.md)
- [Block Reference](./docs/reference/blocks.md)
- [Universal Editor Setup](./docs/how-to/universal-editor.md)

## Getting started

### 1. Github
1. Use this template to make a new repo.
1. Install [AEM Code Sync](https://github.com/apps/aem-code-sync).

### 2. DA content
1. Browse to https://da.live/start.
2. Follow the steps.

### 3. Local development
1. Clone your new repo to your computer.
1. Install the AEM CLI using your terminal: `sudo npm install -g @adobe/aem-cli`
1. Start the AEM CLI: `aem up`.
1. Open the `{repo}` folder in your favorite code editor and build something.
1. **Recommended:** Install common npm packages like linting and testing: `npm i`.

For detailed setup instructions, see the [Getting Started Tutorial](./docs/tutorials/getting-started.md).
