"use strict";
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const DB_DIR = ".vscode";
const DB_FILE = `${DB_DIR}/workbench.json`;
class Project {
    constructor() {
        this.load = () => {
            let dbFilePath = getDbFilePath();
            this.currentWorkbench = new Workbench();
            if (fs.existsSync(dbFilePath)) {
                let fileContent = fs.readFileSync(dbFilePath).toString();
                let fileObject = JSON.parse(fileContent);
                if (fileObject && fileObject["currentWorkbench"] && fileObject["currentWorkbench"]["files"]) {
                    this.currentWorkbench.load(fileObject["currentWorkbench"]["files"]);
                }
            }
        };
        this.save = () => {
            let dbFilePath = getDbFilePath();
            if (!dbFilePath) {
                return;
            }
            try {
                fs.accessSync(dbFilePath, fs.constants.R_OK | fs.constants.W_OK);
            }
            catch (e) {
                console.log("Workbench: file doesn't exist, creating dir...");
                try {
                    fs.mkdirSync(getDbDirectoryPath());
                }
                catch (e) {
                }
            }
            fs.writeFileSync(dbFilePath, JSON.stringify(this, null, "\t"));
        };
    }
}
exports.Project = Project;
class Workbench {
    constructor() {
        this.load = (json) => {
            this.removeAll();
            Array.from(json)
                .map((e) => new File(e.path, e.alias))
                .forEach(this.addFile);
        };
        this.isEmpty = () => {
            return (this.files.length === 0);
        };
        this.count = () => {
            return this.files.length;
        };
        this.addFile = (file) => {
            this.files.push(file);
            exports.project.save();
        };
        this.remove = (file) => {
            this.files = this.files.filter(f => f !== file);
            exports.project.save();
        };
        this.removeAll = () => {
            this.files = [];
            exports.project.save();
        };
        this.findByPath = (path) => {
            return this.files.find((f) => f.path === path) || null;
        };
        this.findByAlias = (alias) => {
            return this.files.find((f) => f.alias === alias);
        };
        this.getAll = () => {
            return this.files.slice();
        };
        this.getAliases = () => {
            return this.files.map((f) => f.alias).sort();
        };
        this.files = [];
    }
}
exports.Workbench = Workbench;
class File {
    constructor(relativePath, alias) {
        this.getAbsolutePath = () => {
            if (path.isAbsolute(this.path)) {
                return this.path;
            }
            else {
                return path.join(vscode.workspace.rootPath, this.path);
            }
        };
        this.path = relativePath;
        this.alias = alias;
    }
}
exports.File = File;
function init() {
    exports.project = new Project();
    exports.project.load();
}
exports.init = init;
function getDbFilePath() {
    if (!vscode.workspace.rootPath) {
        return;
    }
    return path.join(vscode.workspace.rootPath, DB_FILE);
}
exports.getDbFilePath = getDbFilePath;
function getDbDirectoryPath() {
    return path.join(vscode.workspace.rootPath, DB_DIR);
}
//# sourceMappingURL=model.js.map