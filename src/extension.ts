import * as vscode from 'vscode';

type KeyboardMode =
 | "input"
 | "command"

let currentModeIndex = -1
let cachedModeIndex = -1

const modeCycle: KeyboardMode[] = [
	"input",
	"command"
]
const modeDisplayStringLut: Record<KeyboardMode, string> = {
	input: "INPUT",
	command: "COMMAND"
}
const modeCursorColor: Record<KeyboardMode, string> = {
	input: "#00FF00",
	command: "#FF0000",
}
const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1)



const activateMode = async (modeIndex: number) => {
	currentModeIndex = modeIndex
	const mode = modeCycle[currentModeIndex]
	vscode.commands.executeCommand('setContext', 'gs-vscode-modal-bindings.mode', mode);
	statusBarItem.text = modeDisplayStringLut[mode]
	statusBarItem.show();
	console.log("!!!")
	await vscode.workspace.getConfiguration().update('workbench.colorCustomizations', {
		"editorCursor.foreground": modeCursorColor[mode]
	})
}

const activateModeCacheCurrent = async (modeIndex: number) => {
	cachedModeIndex = currentModeIndex
	await activateMode(modeIndex)
}
const activateCachedMode = async () => {
	if (cachedModeIndex !== -1) {
		await activateMode(cachedModeIndex)
	}
	cachedModeIndex = -1
}


const activateInputMode   = async () => activateMode(0)
const activateCommandMode = async () => activateMode(1)
const activateInputModeCacheCurrent   = async () => activateModeCacheCurrent(0)
const activateCommandModeCacheCurrent = async () => activateModeCacheCurrent(1)

const switchModes = async () => {
	await activateMode((currentModeIndex + 1) % modeCycle.length)
}

export function activate(context: vscode.ExtensionContext) {
	const disposables = [
		vscode.commands.registerCommand('gs-vscode-modal-bindings.switchInputMode', switchModes),
		vscode.commands.registerCommand('gs-vscode-modal-bindings.activateCommandMode', activateCommandMode),
		vscode.commands.registerCommand('gs-vscode-modal-bindings.activateInputMode', activateInputMode),
		vscode.commands.registerCommand('gs-vscode-modal-bindings.activateInputModeCacheCurrent', activateInputModeCacheCurrent),
		vscode.commands.registerCommand('gs-vscode-modal-bindings.activateCommandModeCacheCurrent', activateCommandModeCacheCurrent),
		vscode.commands.registerCommand('gs-vscode-modal-bindings.activateCachedMode', activateCachedMode)
	]
	disposables.forEach((d) => context.subscriptions.push(d))

	switchModes()
}

// This method is called when your extension is deactivated
export function deactivate() {}
