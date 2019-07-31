"use strict";
const vscode = require("vscode");
const model = require("./model");
const commands = require("./commands");
const version = "0.1.7";
const supportedCommands = {
    "workbench.addFile": commands.onCommandAddFile,
    "workbench.listFiles": commands.onCommandListFiles,
    "workbench.openAll": commands.onCommandOpenAll,
    "workbench.removeFile": commands.onCommandRemoveFile,
    "workbench.removeCurrentFile": commands.onCommandRemoveCurrentFile,
    "workbench.clearFiles": commands.onCommandClearFiles,
    "workbench.openConfig": commands.onOpenConfig,
    "workbench.reloadConfig": commands.onReloadConfig,
};
function activate(context) {
    console.log(`Extension 'Workbench' is active (ver: ${version})`);
    Object.keys(supportedCommands).forEach((command) => {
        let handler = supportedCommands[command];
        let disposable = vscode.commands.registerCommand(command, handler);
        context.subscriptions.push(disposable);
    });
    model.init();
    console.log("Extension 'Workbench' is initialized");
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map