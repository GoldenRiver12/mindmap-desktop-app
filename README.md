# Mind Map Desktop App

A desktop mind mapping application built with Electron, React, and TypeScript.

## Features

- Create nodes by clicking on the canvas
- Drag nodes to move them around
- Edit node text by clicking and typing
- Connect nodes by right-clicking (context menu)
- Delete nodes with the × button or Ctrl+Delete
- Visual connections between related nodes

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
npm install
```

### Running in Development Mode

```bash
npm run dev
```

This will start both the webpack dev server for the React renderer and the Electron main process.

### Building for Production

```bash
npm run build
```

### Creating Distribution Package

```bash
npm run dist
```

## Technology Stack

- **Electron** - Desktop app framework
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Webpack** - Module bundler
- **CSS** - Styling

## Usage

1. Click anywhere on the canvas to create a new node
2. Click on a node to select it and edit its text
3. Drag nodes to reposition them
4. Right-click on a node to start connecting it to another node
5. Right-click on another node to complete the connection
6. Use the × button to delete nodes

## License

MIT
