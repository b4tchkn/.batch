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
const clipboard = require("./utils");
const settings_1 = require("./settings");
var ClipboardRingContent = new Array();
class ClipboardRingImpl {
    constructor(current, _content, _maxSize) {
        this._content = _content;
        this._maxSize = _maxSize;
        this._maxSize = Math.max(2, this._maxSize);
        this.popToMaxSize();
        if (current) {
            // find item and rotate to it
            for (let idx = 0; idx < this._content.length; ++idx) {
                let item = this._content[idx];
                if (item == current) {
                    this.next(idx);
                    return;
                }
            }
            this.pushNew(current);
        }
    }
    getCurrent() {
        if (this.empty()) {
            throw new Error("No current item!");
        }
        return this._content[0];
    }
    getAll() {
        return this._content.slice();
    }
    pushNew(content) {
        this._content.unshift(content);
        this.popToMaxSize();
    }
    popCurrent() {
        if (!this.empty()) {
            this._content.shift();
        }
    }
    next(count) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.empty() || count % this.size() == 0)
                return;
            while (count--) {
                let old = this._content.shift();
                this._content.push(old);
            }
        });
    }
    prev(count) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.empty() || count % this.size() == 0)
                return;
            while (count--) {
                let n = this._content.pop();
                this._content.unshift(n);
            }
            yield clipboard.setContent(this.getCurrent());
        });
    }
    size() {
        return this._content.length;
    }
    empty() {
        return this.size() == 0;
    }
    clear() {
        this._content.splice(0);
    }
    remove(idx) {
        this._content.splice(idx, 1);
    }
    popToMaxSize() {
        while (this._content.length > this._maxSize) {
            this._content.pop();
        }
    }
}
function getClipboardRing(forceBackup) {
    return __awaiter(this, void 0, void 0, function* () {
        let settings = settings_1.getSettings();
        let backup = forceBackup || settings.backupClipboard;
        let current = backup ? yield clipboard.getContent() : null;
        return new ClipboardRingImpl(current, ClipboardRingContent, settings.maxRingItems);
    });
}
exports.getClipboardRing = getClipboardRing;
//# sourceMappingURL=clipboard_ring.js.map