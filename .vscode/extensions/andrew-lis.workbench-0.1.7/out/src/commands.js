"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const path = require("path");
const vscode = require("vscode");
const model = require("./model");
function onCommandListFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        let currentWorkbench = model.project.currentWorkbench;
        if (currentWorkbench.isEmpty()) {
            vscode.window.showWarningMessage("Workbench: No files available");
            return;
        }
        let selectedAlias = yield vscode.window.showQuickPick(currentWorkbench.getAliases(), {
            placeHolder: "select a file to open"
        });
        if (selectedAlias) {
            let fileToOpen = currentWorkbench.findByAlias(selectedAlias);
            let document = yield vscode.workspace.openTextDocument(fileToOpen.getAbsolutePath());
            showDocument(document);
        }
    });
}
exports.onCommandListFiles = onCommandListFiles;
function onCommandOpenAll() {
    return __awaiter(this, void 0, void 0, function* () {
        let currentWorkbench = model.project.currentWorkbench;
        if (currentWorkbench.isEmpty()) {
            vscode.window.showWarningMessage("Workbench: No files available");
            return;
        }
        currentWorkbench.getAll().forEach((file) => __awaiter(this, void 0, void 0, function* () {
            let document = yield vscode.workspace.openTextDocument(file.getAbsolutePath());
            showDocument(document);
        }));
    });
}
exports.onCommandOpenAll = onCommandOpenAll;
function onCommandAddFile() {
    let currentWorkbench = model.project.currentWorkbench;
    let file = getActiveEditorFilePath();
    if (!file) {
        return;
    }
    let prefixWithDir = getConfigurationPrefixAliasWithDirName();
    if (currentWorkbench.findByPath(file) === null) {
        let prefixNumber = currentWorkbench.count() + 1;
        let prefixPad = (prefixNumber < 10 ? " " : "");
        let parentDirName = "";
        if (prefixWithDir) {
            let fullPath = vscode.window.activeTextEditor.document.uri.fsPath;
            parentDirName = path.dirname(fullPath).split(path.sep).pop() + "/";
        }
        let filename = path.basename(file);
        let alias = `${prefixPad}${prefixNumber} ${parentDirName}${filename}`;
        currentWorkbench.addFile(new model.File(file, alias));
        vscode.window.setStatusBarMessage(`Workbench: new file added: ${file}`);
    }
    else {
        vscode.window.showInformationMessage(`Workbench: file: ${file} already exists in current workbench`);
    }
}
exports.onCommandAddFile = onCommandAddFile;
function onCommandRemoveFile() {
    return __awaiter(this, void 0, void 0, function* () {
        let currentWorkbench = model.project.currentWorkbench;
        if (currentWorkbench.isEmpty()) {
            vscode.window.showWarningMessage("Workbench: No files available");
            return;
        }
        let selectedAlias = yield vscode.window.showQuickPick(currentWorkbench.getAliases(), {
            placeHolder: "select a file to remove"
        });
        if (selectedAlias) {
            let fileToRemove = currentWorkbench.findByAlias(selectedAlias);
            currentWorkbench.remove(fileToRemove);
            vscode.window.setStatusBarMessage("Workbench: file removed: " + fileToRemove.path);
        }
    });
}
exports.onCommandRemoveFile = onCommandRemoveFile;
function onCommandRemoveCurrentFile() {
    let currentWorkbench = model.project.currentWorkbench;
    if (currentWorkbench.isEmpty()) {
        vscode.window.showWarningMessage("Workbench: No files available");
    }
    let file = getActiveEditorFilePath();
    if (!file) {
        return;
    }
    let fileToRemove = currentWorkbench.findByPath(file);
    if (fileToRemove) {
        currentWorkbench.remove(fileToRemove);
        vscode.window.setStatusBarMessage("Workbench: file removed: " + fileToRemove.path);
    }
}
exports.onCommandRemoveCurrentFile = onCommandRemoveCurrentFile;
function onCommandClearFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        let selectedOption = yield vscode.window.showQuickPick(["no", "yes"], {
            placeHolder: "are you sure - to clear all files from workspace?"
        });
        if (selectedOption === "yes") {
            model.project.currentWorkbench.removeAll();
            vscode.window.setStatusBarMessage("Workbench: all files removed");
        }
    });
}
exports.onCommandClearFiles = onCommandClearFiles;
function onOpenConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        let dbFilePath = model.getDbFilePath();
        if (!dbFilePath) {
            return;
        }
        model.project.save();
        let document = yield vscode.workspace.openTextDocument(dbFilePath);
        showDocument(document);
    });
}
exports.onOpenConfig = onOpenConfig;
function onReloadConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        model.project.load();
    });
}
exports.onReloadConfig = onReloadConfig;
function getActiveEditorFilePath() {
    if (!vscode.window.activeTextEditor) {
        vscode.window.showWarningMessage("Workbench: No file is open");
        return null;
    }
    return vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.uri.fsPath);
}
function showDocument(document) {
    let viewColumn = (vscode.window.activeTextEditor && vscode.window.activeTextEditor.viewColumn
        ? vscode.window.activeTextEditor.viewColumn
        : vscode.ViewColumn.One);
    vscode.window.showTextDocument(document, viewColumn, false);
}
function getConfigurationPrefixAliasWithDirName() {
    let configuration = vscode.workspace.getConfiguration('foxWorkbench');
    return configuration['prefixAliasWithDirName'];
}
//# sourceMappingURL=commands.js.map