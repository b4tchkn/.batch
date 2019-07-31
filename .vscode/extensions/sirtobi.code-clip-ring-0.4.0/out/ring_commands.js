"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const cring = require("./clipboard_ring");
const utils = require("./utils");
const settings_1 = require("./settings");
function copyToRing() {
    return __awaiter(this, void 0, void 0, function* () {
        yield cring.getClipboardRing(false);
        yield utils.vscodeCopy();
        yield cring.getClipboardRing(true);
    });
}
exports.copyToRing = copyToRing;
function cutToRing() {
    return __awaiter(this, void 0, void 0, function* () {
        yield cring.getClipboardRing(false);
        yield utils.vscodeCut();
        yield cring.getClipboardRing(true);
    });
}
exports.cutToRing = cutToRing;
class SelectionSaver {
    constructor(_selections) {
        this._selections = _selections;
        SelectionSaver.sortSelections(this._selections);
    }
    /**
     * Checke if the argument is a new selection.
     * A new selection must contain at least one selection that is different from the previous.
     */
    isNewSelecton(selections) {
        SelectionSaver.sortSelections(selections);
        let idx = 0;
        for (let sel of selections) {
            while (true) {
                if (idx >= this._selections.length)
                    return true;
                let cur = this._selections[idx];
                ++idx;
                // TODO: Check if strings are equal or reset selectionsaver
                if (cur.isEqual(sel))
                    break;
                let cmp = SelectionSaver.compareSelections(cur, sel);
                if (cmp > 0)
                    return true;
            }
        }
        return false;
    }
    static sortSelections(selections) {
        selections.sort(SelectionSaver.compareSelections);
    }
    static compareSelections(a, b) {
        return a.start.line == b.start.line ?
            a.start.character - b.start.character
            : a.start.line - b.start.line;
    }
}
var LastSelection = null;
function pasteRingItem(ring) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ring == null) {
            ring = yield cring.getClipboardRing(false);
        }
        let editor = vscode.window.activeTextEditor;
        if (!editor || ring.empty())
            return;
        let selections = editor.selections;
        if (LastSelection && !LastSelection.isNewSelecton(selections)) {
            yield ring.next(1);
        }
        yield editor.edit((eb) => {
            for (let sel of selections) {
                eb.replace(sel, ring.getCurrent());
            }
        });
        if (settings_1.getSettings().itemToClipboardOnPaste) {
            yield utils.setContent(ring.getCurrent());
        }
        LastSelection = new SelectionSaver(editor.selections);
    });
}
exports.pasteRingItem = pasteRingItem;
function textToString(text) {
    let length = 0;
    let lines = text.split('\n').map(line => {
        if (length >= 80) {
            return "";
        }
        else {
            line = line.replace(/\s+/g, " ");
            line = line.replace(/^\s+|\s+$/g, '');
            length += line.length;
            return line;
        }
    }).filter(line => line != "");
    return lines.join(" ⏎ ");
}
function selectRingItem(ring, placeHolder) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ring.empty()) {
            yield vscode.window.showErrorMessage("No current clipboard item");
            return -1;
        }
        else {
            let idx = 0;
            let items = ring.getAll().map((item) => {
                return {
                    label: `${idx + 1}: ${textToString(item)}`,
                    index: idx++,
                    description: ""
                };
            });
            let opt = {
                placeHolder: placeHolder
            };
            let selectedItem = yield vscode.window.showQuickPick(items, opt);
            if (!selectedItem)
                return -1;
            return selectedItem.index;
        }
    });
}
function selectAndPasteRingItem() {
    return __awaiter(this, void 0, void 0, function* () {
        let ring = yield cring.getClipboardRing(false);
        let itemIdx = yield selectRingItem(ring, "Item to paste");
        if (itemIdx >= 0) {
            LastSelection = null;
            yield ring.next(itemIdx);
            yield pasteRingItem(ring);
            let editor = vscode.window.activeTextEditor;
            if (editor && !settings_1.getSettings().selectTextAfterPasteFromMenu) {
                editor.selections = editor.selections.map(squashSelectionToEnd);
            }
        }
    });
}
exports.selectAndPasteRingItem = selectAndPasteRingItem;
function squashSelectionToEnd(sel) {
    return new vscode.Selection(sel.end, sel.end);
}
function removeRingItems() {
    return __awaiter(this, void 0, void 0, function* () {
        let ring = yield cring.getClipboardRing(false);
        let itemIdx = yield selectRingItem(ring, "Item to remove");
        if (itemIdx >= 0) {
            ring.remove(itemIdx);
        }
    });
}
exports.removeRingItems = removeRingItems;
function removeAllRingItem() {
    return __awaiter(this, void 0, void 0, function* () {
        let ring = yield cring.getClipboardRing(false);
        ring.clear();
    });
}
exports.removeAllRingItem = removeAllRingItem;
//# sourceMappingURL=ring_commands.js.map