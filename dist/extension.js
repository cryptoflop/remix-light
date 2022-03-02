"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.activate = void 0;
var vscode = require("vscode");
var chain_1 = require("./chain");
var RemixView_1 = require("./remix-view/RemixView");
function activate(context) {
    var _this = this;
    var out = vscode.window.createOutputChannel('Remix-Light');
    // TODO: use environments
    vscode.commands.executeCommand('setContext', 'remix-light.debug', true);
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var chain, resources, solFiles, updateSolFiles, setOpenedContract, compileContract, remixViewProvider;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chain_1.Chain.spinup()];
                case 1:
                    chain = _a.sent();
                    resources = new Proxy({}, {
                        set: function (target, prop, value) {
                            target[prop] = value;
                            remixViewProvider === null || remixViewProvider === void 0 ? void 0 : remixViewProvider.send({ event: 'resourceUpdate', data: { resource: prop, data: value } });
                            return true;
                        }
                    });
                    // set defaults
                    Object.entries({
                        useCompiler: true,
                        autoCompile: false,
                        compilerVersion: 'Version1',
                        compiledContracts: {}
                    }).map(function (v) { return resources[v[0]] = v[1]; });
                    solFiles = [];
                    updateSolFiles = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, vscode.workspace.findFiles('**/*.sol')];
                                case 1:
                                    solFiles = (_a.sent());
                                    resources['contracts'] = solFiles.map(function (uri) { return uri.path; });
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    vscode.workspace.onDidDeleteFiles(updateSolFiles);
                    vscode.workspace.onDidCreateFiles(updateSolFiles);
                    vscode.workspace.onDidRenameFiles(updateSolFiles);
                    updateSolFiles();
                    setOpenedContract = function (e) {
                        if (e === null || e === void 0 ? void 0 : e.document.uri.fsPath.endsWith('.sol')) {
                            resources['openedContract'] = e.document.uri.path;
                        }
                    };
                    vscode.window.onDidChangeActiveTextEditor(setOpenedContract);
                    setOpenedContract(vscode.window.activeTextEditor);
                    compileContract = function (file) {
                        var _a;
                        resources.compiledContracts = __assign(__assign({}, resources.compiledContracts), (_a = {}, _a[file.path] = true, _a));
                    };
                    vscode.workspace.onDidSaveTextDocument(function (e) {
                        if (e.uri.fsPath.endsWith('.sol') && resources.autoCompile) {
                            compileContract(e.uri);
                        }
                    });
                    remixViewProvider = new RemixView_1["default"](context.extensionUri, {
                        log: function (line) {
                            out.appendLine(line);
                        },
                        subscribeToResource: function (resource) { return __awaiter(_this, void 0, void 0, function () {
                            var data, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = resource;
                                        switch (_a) {
                                            case 'accounts': return [3 /*break*/, 1];
                                        }
                                        return [3 /*break*/, 3];
                                    case 1: return [4 /*yield*/, chain.web3.eth.getAccounts()];
                                    case 2:
                                        data = _b.sent();
                                        return [3 /*break*/, 3];
                                    case 3:
                                        if (data !== undefined) {
                                            resources[resource] = data;
                                        }
                                        else {
                                            resources[resource] = resources[resource];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); },
                        setResource: function (msg) {
                            switch (msg.resource) {
                                case 'autoCompile':
                                    if (msg.data) {
                                        for (var _i = 0, solFiles_1 = solFiles; _i < solFiles_1.length; _i++) {
                                            var file = solFiles_1[_i];
                                            compileContract(file);
                                        }
                                    }
                                    break;
                            }
                            resources[msg.resource] = msg.data;
                        },
                        setActiveContract: function (contract) { return __awaiter(_this, void 0, void 0, function () {
                            var file, _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        file = solFiles.find(function (f) { return f.path.includes(contract); });
                                        if (!file) return [3 /*break*/, 3];
                                        _b = (_a = vscode.window).showTextDocument;
                                        return [4 /*yield*/, vscode.workspace.openTextDocument(file)];
                                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                                    case 2:
                                        _c.sent();
                                        _c.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }
                    });
                    context.subscriptions.push(vscode.commands.registerCommand('remix-light.reload', function () {
                        remixViewProvider.reload();
                    }));
                    context.subscriptions.push(vscode.window.registerWebviewViewProvider('remix-light-view', remixViewProvider));
                    return [2 /*return*/];
            }
        });
    }); })();
}
exports.activate = activate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2V4dGVuc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUFpQztBQUNqQyxpQ0FBZ0M7QUFDaEMsb0RBQXVEO0FBRXZELFNBQWdCLFFBQVEsQ0FBQyxPQUFnQztJQUF6RCxpQkFvR0M7SUFuR0MsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUU3RCx5QkFBeUI7SUFDekIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBRXhFLENBQUM7Ozs7O3dCQUVlLHFCQUFNLGFBQUssQ0FBQyxNQUFNLEVBQUUsRUFBQTs7b0JBQTVCLEtBQUssR0FBRyxTQUFvQjtvQkFFNUIsU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRTt3QkFDOUIsR0FBRyxFQUFILFVBQUksTUFBa0MsRUFBRSxJQUFZLEVBQUUsS0FBYzs0QkFDbEUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQzs0QkFDckIsaUJBQWlCLGFBQWpCLGlCQUFpQix1QkFBakIsaUJBQWlCLENBQUUsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs0QkFDNUYsT0FBTyxJQUFJLENBQUM7d0JBQ2QsQ0FBQztxQkFDRixDQUFDLENBQUM7b0JBRUgsZUFBZTtvQkFDZixNQUFNLENBQUMsT0FBTyxDQUFDO3dCQUNiLFdBQVcsRUFBRSxJQUFJO3dCQUNqQixXQUFXLEVBQUUsS0FBSzt3QkFDbEIsZUFBZSxFQUFFLFVB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