import * as vscode from 'vscode';

type KeyboardMode = 
 | "input"
 | "command"

let currentModeIndex = -1
const modeCycle: KeyboardMode[] = [
	"input",
	"command"
]
const modeDisplayStringLut: Record<KeyboardMode, string> = {
	input: "INPUT",
	command: "COMMAND"
}
const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1)

const activateMode = (modeIndex: number) => {
	currentModeIndex = modeIndex
	const mode = modeCycle[currentModeIndex]
	vscode.commands.executeCommand('setContext', 'gs-vscode-modal-bindings.mode', mode);
	statusBarItem.text = modeDisplayStringLut[mode]
	statusBarItem.show();
}

const activateInputMode   = () => activateMode(0)
const activateCommandMode = () => activateMode(1)

const switchModes = () => {
	activateMode((currentModeIndex + 1) % modeCycle.length)
}

export function activate(context: vscode.ExtensionContext) {
	const disposables = [
		vscode.commands.registerCommand('gs-vscode-modal-bindings.switchInputMode', switchModes),
		vscode.commands.registerCommand('gs-vscode-modal-bindings.activateCommandMode', activateCommandMode),
		vscode.commands.registerCommand('gs-vscode-modal-bindings.activateInputMode', activateInputMode),
	]
	disposables.forEach((d) => context.subscriptions.push(d))

	switchModes()
}

// This method is called when your extension is deactivated
export function deactivate() {}
