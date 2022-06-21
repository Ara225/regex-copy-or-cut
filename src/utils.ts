import * as vscode from 'vscode';

/**
 * Show input box, return result
 * @param {typeof vscode.window} window
 */
async function showInputBox(window: typeof vscode.window) {
    var result = await window.showInputBox({
        placeHolder: 'Search term (regular expression)'
    });
    return result;
}

/**
 * Function to get lines matching the search term in the editor
 * @param {vscode.TextEditor} editor
 *   A text editor, should be the currently active one
 * @param {string} searchTerm
 *   A regular expression
 * @returns {Array}
 *   Array containing a list of ranges of the matching lines (item 0) and the text of them (item 1)
 * @todo Optionally offer plain string matching
 */
function getMatchingLines(editor: vscode.TextEditor, searchTerm: string): [vscode.Range[], string] {
    let currentLine: vscode.TextLine;
    let lineContent: string;
    let listOfRanges: Array<vscode.Range> = [];
    let text: string = '';
    // The end of line most commonly used in the document
    const endOfLine = editor.document.eol;
    try {
        // iterate though the lines in the document
        for (let index = 0; index < editor.document.lineCount; index++) {
            // Get the current line
            currentLine = editor.document.lineAt(index);
            // Get the text of the current line
            lineContent = currentLine.text;
    
            // If the regex provided in searchTerm matches part of the line
            if (lineContent.search(searchTerm) !== -1) {
    
                // Append correct end of line char to the line and append to the text string
                if (endOfLine === vscode.EndOfLine.CRLF) {
                    text += currentLine.text + "\r\n";
                }
                else if (endOfLine === vscode.EndOfLine.LF) {
                    text += currentLine.text + "\n";
                }
    
                // Append the result to the list of ranges
                listOfRanges.push(currentLine.rangeIncludingLineBreak);
            }
        }
    }
    catch (e) {
        vscode.window.showErrorMessage('Unable to complete action due to unexpected error ' + e);
    }
    return [listOfRanges, text];
}

/**
 * The function that deletes, copies and cuts based on the output of the other functions
 * @param {string} mode The mode to work in - copy, cut or delete
 * @param {boolean} shouldOpenNewTab Whether we should open a new tab and paste the text into it
 */
export function commandsImplementation(mode: string, shouldOpenNewTab: boolean) {
    const window = vscode.window;
    var result = showInputBox(window);
    var editor = vscode.window.activeTextEditor;

    // Action to be taken when box is submitted
    result.then(searchTerm => {
        try {
            // Ensuring search term is not invalid
            if (searchTerm === '' || typeof searchTerm === 'undefined') {
                window.showErrorMessage('Empty search term');
            }
            else {
                if (typeof editor === 'undefined') {
                    window.showErrorMessage('Editor object is undefined, should not happen but TypeScript wants me to do this');
                    return;
                }
                // Get matching lines
                var lines = getMatchingLines(editor, searchTerm);
                // If there are matching lines
                if (lines[1] !== '') {
                    if (mode === "cut" || mode === "copied") {
                        // Write text to clipboard
                        vscode.env.clipboard.writeText(lines[1]);
                    }

                    // Delete lines
                    if (mode === "cut" || mode === "deleted") {
                        editor.edit(function (builder) {
                            for (let index = 0; index < lines[0].length; index++) {
                                builder.delete(lines[0][index]);
                            }
                        });
                    }
                    if (shouldOpenNewTab === true) {
                        openDocWithClipboardText();
                    }
                    
                    // Inform user of success
                    window.showInformationMessage(String(lines[0].length) + ' lines were ' + mode);
                }
                else {
                    window.showInformationMessage('No match found');
                }
            }
        }
        catch (e) {
            window.showErrorMessage('Unable to complete action due to unexpected error ' + e);
        }
    });
}

/**
 * Open new document with clipboard text pasted into it
 */
export function openDocWithClipboardText() {
    try {
        // Set the title of the new document to Untitled
        var setting = vscode.Uri.parse("untitled:Untitled - " + new Date().toTimeString().split(' ')[0] + ' ' + new Date().toDateString());
        // Read clipboard text
        var clipboardText = vscode.env.clipboard.readText();
        // Register call back to paste into new doc
        clipboardText.then((text: string) => {
            vscode.workspace.openTextDocument(setting).then((a) => {
                vscode.window.showTextDocument(a, 1, false).then(e => {
                    e.edit(edit => {
                        edit.insert(new vscode.Position(0, 0), text);
                    });
                });
            });
        });
    }
    catch (e) {
        vscode.window.showErrorMessage('Unable to complete action due to unexpected error ' + e);
    }
}
