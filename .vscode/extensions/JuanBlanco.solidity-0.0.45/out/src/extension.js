'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const compileAll_1 = require("./compileAll");
const compileActive_1 = require("./compileActive");
const codegen_1 = require("./codegen");
const vscode_languageclient_1 = require("vscode-languageclient");
const soliumClientFixer_1 = require("./linter/soliumClientFixer");
let diagnosticCollection;
function activate(context) {
    diagnosticCollection = vscode.languages.createDiagnosticCollection('solidity');
    context.subscriptions.push(diagnosticCollection);
    compileActive_1.initDiagnosticCollection(diagnosticCollection);
    context.subscriptions.push(vscode.commands.registerCommand('solidity.compile.active', () => {
        compileActive_1.compileActiveContract();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('solidity.compile', () => {
        compileAll_1.compileAllContracts(diagnosticCollection);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('solidity.codegen', (args) => {
        codegen_1.codeGenerate(args, diagnosticCollection);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('solidity.codegenCSharpProject', (args) => {
        codegen_1.codeGenerateNethereumCQSCsharp(args, diagnosticCollection);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('solidity.codegenVbNetProject', (args) => {
        codegen_1.codeGenerateNethereumCQSVbNet(args, diagnosticCollection);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('solidity.codegenFSharpProject', (args) => {
        codegen_1.codeGenerateNethereumCQSFSharp(args, diagnosticCollection);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('solidity.fixDocument', () => {
        soliumClientFixer_1.lintAndfixCurrentDocument();
    }));
    const serverModule = path.join(__dirname, 'server.js');
    const serverOptions = {
        debug: {
            module: serverModule,
            options: {
                execArgv: ['--nolazy', '--debug=6004'],
            },
            transport: vscode_languageclient_1.TransportKind.ipc,
        },
        run: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
        },
    };
    const clientOptions = {
        documentSelector: [
            { language: 'solidity', scheme: 'file' },
            { language: 'solidity', scheme: 'untitled' },
        ],
        revealOutputChannelOn: vscode_languageclient_1.RevealOutputChannelOn.Never,
        synchronize: {
            // Synchronize the setting section 'solidity' to the server
            configurationSection: 'solidity',
        },
    };
    const clientDisposible = new vscode_languageclient_1.LanguageClient('solidity', 'Solidity Language Server', serverOptions, clientOptions).start();
    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(clientDisposible);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map