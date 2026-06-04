# Port Sync - Monitor Ports at Ease

`Summary` : Monitor and map active development ports in real-time inside Visual Studio Code.

## Overview

PortSync is a VS Code extension that helps developers keep track of active ports while working on local web servers, APIs, containers, and other development services. It provides a dedicated sidebar view showing open ports and lets you quickly identify which services are running.

## Features

* Sidebar view for active ports, updated in real time
* Easy access to running service ports without leaving VS Code
* Command palette integration for quick activation
* Designed for local development workflows and debugging sessions
* Compatible with Windows, Mac and Linux

## How to Use

1. Open VS Code inside your project workspace.
2. Install PortSync from the VS Code Extension Marketplace or load it locally in development mode.
3. Open the `Port Sync - Monitor your Ports` view from the activity bar.
4. Use the command palette and run `Port Sync - Monitor Real Time Working Ports`.

## Installation

### From VS Code

1. Open the Extensions view (`Ctrl+Shift+X`).
2. Search for `PortSync`.
3. Install and reload VS Code by pressing :
``` bash
Ctrl+Shift+P - Reload Window
```

### Local development

1. Clone the repository.
2. Run `npm install`.
3. Change the `tsconfig.json` and `package.json` as required
4. Build the extension:

```bash
npm run compile
```

5. Press `F5` to start a new Extension Development Host instance.

## Extension Commands

* `portsync.getActivePorts` — Monitor Real Time Working Ports

## Development

### Build

```bash
npm run compile
```

### Watch

```bash
npm run watch
```

### Test

```bash
npm test
```

## Repository Structure

* `src/extension.ts` - main extension activation and command registration
* `src/views/sideBar.ts` - sidebar view logic
* `src/test/extension.test.ts` - extension tests
* `src/assets` - All Logos and Sidebar icon images
* `package.json` - extension metadata and commands
* `tsconfig.json` - TypeScript configuration

## Contributing

Contributions are welcome ! If you find a bug or want to suggest a feature:

1. Open an issue.
2. Submit a pull request.

Please follow the repository's coding style ,folder naming conventions and make sure tests pass before submitting changes.

## License

PortSync is licensed under the MIT License. See the [`LICENSE`](https://github.com/Pranava-Pai-N/Port-Sync-Extension/blob/main/LICENSE) file for details.


## CHANGELOG
Project versions and changes included in each version can be viewed in the [`CHANGELOG.md`](https://github.com/Pranava-Pai-N/Port-Sync-Extension/blob/main/CHANGELOG.md) file.

## Download from Marketplace
```bash
https://marketplace.visualstudio.com/items?itemName=pranava-pai-n.portsync
```

## Developer

#### Author - **Pranava Pai**

#### Connect with me :

- GitHub: [Pranava Pai N](https://github.com/pranava-pai-n)
- Portfolio: [Portfolio Website](https://pranava-pai.live)
- npm: [NPM Profile](https://www.npmjs.com/~pranava_pai_n)
