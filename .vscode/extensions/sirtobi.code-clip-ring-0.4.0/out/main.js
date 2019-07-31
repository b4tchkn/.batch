"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const ringcmd = require("./ring_commands");
function activate(context) {
    console.log('Extension "code-clip-ring" is now active!');
    // Ring commands
    var disposable = vscode.commands.registerCommand('clipring.copyToRing', ringcmd.copyToRing);
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('clipring.cutToRing', ringcmd.cutToRing);
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('clipring.pasteRingItem', () => ringcmd.pasteRingItem(null));
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('clipring.selectAndPasteRingItem', ringcmd.selectAndPasteRingItem);
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('clipring.removeAllRingItems', ringcmd.removeAllRingItem);
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('clipring.removeRingItem', ringcmd.removeRingItems);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=main.js.map