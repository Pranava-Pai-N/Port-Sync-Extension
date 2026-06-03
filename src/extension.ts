import * as vscode from 'vscode';
import fs from "fs";
import * as net from "net";
import { exec } from "child_process";
import { SidebarProvider } from './views/sideBar';


export interface PortItems {
	name: string
	port: number
	status?: "Active" | "Inactive"
}

type portStatus = "Active" | "Inactive";


function checkTerminal(cmd: string): Promise<string> {
	return new Promise((resolve) => {
		exec(cmd, (error, stdout) => {
			if (error) {
				resolve(`Error executing the commands`);
			}
			resolve(stdout);
		});
	});
}

async function discoverActivePorts(): Promise<PortItems[]> {
	const discoveredPorts: PortItems[] = [];
	const seenPorts = new Set<number>();

	const envFiles = await vscode.workspace.findFiles("**/.env*");

	for (const file of envFiles) {
		try {
			const contents = fs.readFileSync(file.fsPath, "utf-8");

			const matches = contents.matchAll(/(?:PORT|VITE_PORT|NEXT_PUBLIC_PORT|DB_PORT|BACKEND_PORT)\s*=\s*(\d+)/g);

			for (const match of matches) {
				const portNumber = parseInt(match[1], 10);

				if (!seenPorts.has(portNumber)) {
					seenPorts.add(portNumber);
					discoveredPorts.push({
						name: `Port - ${portNumber}`,
						port: portNumber,
						status : "Inactive"
					});
				}
			}
		} catch (error: any) {
			console.error(`Error reading file ${file.fsPath}:`, error);
		}

		const commonPorts = [3000, 3001, 5000, 5173, 8000, 8080, 27017, 5432, 6379];

		const isWindows = process.platform === 'win32';

		if (isWindows) {
			const output = await checkTerminal('netstat -ano -p tcp');

			for (const port of commonPorts) {
				if (!seenPorts.has(port) && output.includes(`:${port} `)) {
					seenPorts.add(port);
					discoveredPorts.push({
						name: `Port - ${port}`,
						port: port
					});
				}
			}
		}
		else {
			const output = await checkTerminal('lsof -iTCP -sTCP:LISTEN -P -n');

			for (const port of commonPorts) {
				if (!seenPorts.has(port) && output.includes(`:${port}`)) {
					seenPorts.add(port);
					discoveredPorts.push({
						name: `Port - ${port}`,
						port: port
					});
				}
			}
		}

	}
	return discoveredPorts;
}

function checkPortStatus(port: number): Promise<portStatus> {
	return new Promise((resolve) => {
		const server = net.createServer();

		server.once('error', () => resolve('Active'));

		server.once("listening", () => {
			server.close();
			resolve("Inactive");
		});

		server.listen(port);
	});
}

async function getPortStatusMap(): Promise<PortItems[]> {
	const allDiscoveredPorts = await discoverActivePorts();

	const statuses = allDiscoveredPorts.map(async (item) => {
		const status = await checkPortStatus(item.port);

		return { ...item, status };
	});
	return Promise.all(statuses);
}


export async function activate(context: vscode.ExtensionContext) {
	await vscode.window.showInformationMessage('PortSync is now active!');

	const sidebarProvider = new SidebarProvider();

	let activeWebviewView: vscode.WebviewView | undefined = undefined;

	const runUpdateInterval = (webviewView: vscode.WebviewView | undefined) => {
		if (!webviewView) {
			return;
		}

		getPortStatusMap().then((updatedPorts) => {
			webviewView.webview.postMessage(updatedPorts);
		});
	};

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, {
			resolveWebviewView(webviewView) {
				sidebarProvider.resolveWebviewView(webviewView);

				activeWebviewView = webviewView;

				runUpdateInterval(webviewView);

				const pollingTimer = setInterval(() => {
					runUpdateInterval(webviewView);
				}, 5000);

				webviewView.onDidDispose(() => {
					clearInterval(pollingTimer);
					activeWebviewView = undefined;
				});

				webviewView.webview.onDidReceiveMessage((message) => {
					switch (message.command) {
						case 'triggerRefresh': {
							vscode.commands.executeCommand('portsync.getActivePorts');
							break;
						}
					}
				});
			}
		})
	);

	const refreshCommand = vscode.commands.registerCommand('portsync.getActivePorts', async () => {
		if (activeWebviewView) {
			runUpdateInterval(activeWebviewView);
			vscode.window.showInformationMessage('PortSync scan completed. Check the active ports in the sidebar.');
		} else {
			vscode.window.showWarningMessage('Please open the PortSync sidebar view first to refresh data.');
		}
	});

	context.subscriptions.push(refreshCommand);
}

export async function deactivate() {
	console.log("Extension deactivated. Please activate again to use it ... ");
	await vscode.window.showInformationMessage("Extension deactivated. Please activate again to use it ... ");
}
