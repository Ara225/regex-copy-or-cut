// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as utils from './utils';
/**
 * Function called on activation of the extension
 * @param {vscode.ExtensionContext} context
 */
 export function activate(context: vscode.ExtensionContext) {
    // Command to delete lines
    let deleteLinesCommand = vscode.commands.registerTextEditorCommand('regex-copy-or-cut.deleteLines', function () {
        utils.commandsImplementation('deleted', false);
    });

    let cutLinesCommand = vscode.commands.registerTextEditorCommand('regex-copy-or-cut.cutLines', function () {
        utils.commandsImplementation('cut', false);
    });

    let copyLinesCommand = vscode.commands.registerTextEditorCommand('regex-copy-or-cut.copyLines', function () {
        utils.commandsImplementation('copied', false);
    });

    let cutToNewDocCommand = vscode.commands.registerTextEditorCommand('regex-copy-or-cut.cutToNewDocCommand', function () {
        utils.commandsImplementation('cut', true);
    });

    let copyToNewDocCommand = vscode.commands.registerTextEditorCommand('regex-copy-or-cut.copyToNewDocCommand', function () {
        utils.commandsImplementation('copied', true);
    });

    context.subscriptions.push(deleteLinesCommand);
    context.subscriptions.push(copyLinesCommand);
    context.subscriptions.push(cutLinesCommand);
    context.subscriptions.push(cutToNewDocCommand);
    context.subscriptions.push(copyToNewDocCommand);
	console.log("Regex copy and cut activated");
}

export function deactivate() { }