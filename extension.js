const vscode = require('vscode');
const utils = require('./utils');


/**
 * Function called on activation of the extension.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Command to delete lines
    let deleteLinesCommand = vscode.commands.registerTextEditorCommand('extension.deleteLines', function () {
        utils.commandsImplementation('delete')
    });

    let cutLinesCommand = vscode.commands.registerTextEditorCommand('extension.cutLines', function () {
        utils.commandsImplementation('cut')
    });

    let copyLinesCommand = vscode.commands.registerTextEditorCommand('extension.copyLines', function () {
        utils.commandsImplementation('copy');
    });

    let cutToNewDocCommand = vscode.commands.registerTextEditorCommand('extension.cutToNewDocCommand', function () {
        utils.commandsImplementation('cut');
        utils.openDocWithClipboardText();
    });

    let copyToNewDocCommand = vscode.commands.registerTextEditorCommand('extension.copyToNewDocCommand', function () {
        utils.commandsImplementation('copy');
        utils.openDocWithClipboardText();
    });

    context.subscriptions.push(deleteLinesCommand);
    context.subscriptions.push(copyLinesCommand);
    context.subscriptions.push(cutLinesCommand);
    context.subscriptions.push(cutToNewDocCommand);
    context.subscriptions.push(copyToNewDocCommand);
}

exports.activate = activate;

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
