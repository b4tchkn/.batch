'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const abicodegen = require("abi-code-gen");
const fs = require("fs");
const path = require("path");
const codegen = require("nethereum-codegen");
function codeGenerate(args, diagnostics) {
    try {
        let editor = vscode.window.activeTextEditor;
        abicodegen.generateCode(editor.document.fileName, 'cs-service');
    }
    catch (e) {
        let outputChannel = vscode.window.createOutputChannel('solidity code generation');
        outputChannel.clear();
        outputChannel.appendLine('Error generating code:');
        outputChannel.appendLine(e.message);
        outputChannel.show();
    }
}
exports.codeGenerate = codeGenerate;
function codeGenerateNethereumCQSCsharp(args, diagnostics) {
    let extension = '.csproj';
    let lang = 0;
    codeGenerateCQS(extension, lang, args, diagnostics);
}
exports.codeGenerateNethereumCQSCsharp = codeGenerateNethereumCQSCsharp;
function codeGenerateNethereumCQSVbNet(args, diagnostics) {
    let extension = '.vbproj';
    let lang = 1;
    codeGenerateCQS(extension, lang, args, diagnostics);
}
exports.codeGenerateNethereumCQSVbNet = codeGenerateNethereumCQSVbNet;
function codeGenerateNethereumCQSFSharp(args, diagnostics) {
    let extension = '.fsproj';
    let lang = 3;
    codeGenerateCQS(extension, lang, args, diagnostics);
}
exports.codeGenerateNethereumCQSFSharp = codeGenerateNethereumCQSFSharp;
function codeGenerateCQS(extension, lang, args, diagnostics) {
    try {
        let editor = vscode.window.activeTextEditor;
        let root = vscode.workspace.workspaceFolders[0];
        let prettyRootName = prettifyRootNameAsNamespace(root.name);
        let baseNamespace = prettyRootName + '.Contracts';
        let projectName = baseNamespace + extension;
        let fileName = editor.document.fileName;
        let outputPathInfo = path.parse(fileName);
        let contractName = outputPathInfo.name;
        let projectPath = path.join(root.uri.fsPath, baseNamespace);
        let compilationOutput = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        let abi = compilationOutput.abi;
        let contractByteCode = compilationOutput.bytecode;
        codegen.generateNetStandardClassLibrary(projectName, projectPath);
        codegen.generateAllClasses(abi, contractByteCode, contractName, baseNamespace, projectPath, lang);
    }
    catch (e) {
        let outputChannel = vscode.window.createOutputChannel('solidity code generation');
        outputChannel.clear();
        outputChannel.appendLine('Error generating code:');
        outputChannel.appendLine(e.message);
        outputChannel.show();
    }
}
// remove - and make upper case
function prettifyRootNameAsNamespace(value) {
    return value.split('-').map(function capitalize(part) {
        return part.charAt(0).toUpperCase() + part.slice(1);
    }).join('');
}
//# sourceMappingURL=codegen.js.map