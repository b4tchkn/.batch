"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function getSettings() {
    let setting = vscode.workspace.getConfiguration("clipring");
    return {
        maxRingItems: setting.get("maxRingItems"),
        itemToClipboardOnPaste: setting.get("itemToClipboardOnPaste"),
        backupClipboard: setting.get("backupClipboard"),
        selectTextAfterPasteFromMenu: setting.get("selectTextAfterPasteFromMenu"),
    };
}
exports.getSettings = getSettings;
//# sourceMappingURL=settings.js.map