"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Solium = require("solium");
const vscode_languageserver_1 = require("vscode-languageserver");
exports.defaultSoliumRules = {};
class SoliumService {
    constructor(soliumRules, vsConnection) {
        this.vsConnection = vsConnection;
        this.setIdeRules(soliumRules);
    }
    setIdeRules(soliumRules) {
        if (typeof soliumRules === 'undefined' || soliumRules === null) {
            this.soliumRules = exports.defaultSoliumRules;
        }
        else {
            this.soliumRules = soliumRules;
        }
    }
    lintAndFix(documentText) {
        return Solium.lintAndFix(documentText, this.getAllSettings());
    }
    getAllSettings() {
        return {
            'extends': 'solium:recommended',
            'options': { 'returnInternalIssues': true },
            'plugins': ['security'],
            'rules': this.soliumRules,
        };
    }
    validate(filePath, documentText) {
        let items = [];
        try {
            items = Solium.lint(documentText, this.getAllSettings());
        }
        catch (err) {
            let match = /An error .*?\nSyntaxError: (.*?) Line: (\d+), Column: (\d+)/.exec(err.message);
            if (match) {
                let line = parseInt(match[2], 10) - 1;
                let character = parseInt(match[3], 10) - 1;
                return [
                    {
                        message: `Syntax error: ${match[1]}`,
                        range: {
                            end: {
                                character: character,
                                line: line,
                            },
                            start: {
                                character: character,
                                line: line,
                            },
                        },
                        severity: vscode_languageserver_1.DiagnosticSeverity.Error,
                    },
                ];
            }
            else {
                // this.vsConnection.window.showErrorMessage('solium error: ' + err);
                this.vsConnection.console.error('solium error: ' + err);
            }
        }
        return items.map(this.soliumLintResultToDiagnostic);
    }
    soliumLintResultToDiagnostic(lintResult) {
        const severity = lintResult.type === 'warning' ?
            vscode_languageserver_1.DiagnosticSeverity.Warning :
            vscode_languageserver_1.DiagnosticSeverity.Error;
        const line = lintResult.line - 1;
        return {
            message: `${lintResult.ruleName}: ${lintResult.message}`,
            range: {
                end: {
                    character: lintResult.node.end,
                    line: line,
                },
                start: {
                    character: lintResult.column,
                    line: line,
                },
            },
            severity: severity,
        };
    }
}
exports.default = SoliumService;
//# sourceMappingURL=solium.js.map