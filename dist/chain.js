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
exports.Chain = exports.EMPTY = void 0;
var remix_simulator_1 = require("@remix-project/remix-simulator");
var ethereumjs_util_1 = require("ethereumjs-util");
// ugly web3 🤮
// eslint-disable-next-line @typescript-eslint/no-var-requires
var Web3 = require('web3');
exports.EMPTY = '0x';
var Chain = /** @class */ (function () {
    function Chain(web3Instance) {
        this.web3 = web3Instance;
    }
    Chain.spinup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var chain, web3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chain = new remix_simulator_1.Provider({ fork: 'london' });
                        return [4 /*yield*/, chain.init()];
                    case 1:
                        _a.sent();
                        web3 = new Web3(chain);
                        (0, remix_simulator_1.extend)(web3);
                        return [2 /*return*/, new Chain(web3)];
                }
            });
        });
    };
    Chain.prototype.deployContract = function (from, abi) {
        return __awaiter(this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendTx({
                            from: from,
                            data: abi
                        })];
                    case 1:
                        tx = _a.sent();
                        return [2 /*return*/, tx.contractAddress];
                }
            });
        });
    };
    Chain.prototype.runContractFunction = function (from, contract, abi, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendTx({
                            from: from,
                            to: contract,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            data: this.web3.eth.abi.encodeFunctionCall(abi, params)
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Chain.prototype.callContractFunction = function (from, contract, abi, type) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = this.web3.eth.abi).decodeParameter;
                        _c = [type];
                        return [4 /*yield*/, this.web3.eth.call({
                                from: from,
                                to: contract,
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data: this.web3.eth.abi.encodeEventSignature(abi)
                            })];
                    case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
                }
            });
        });
    };
    Chain.prototype.sendEth = function (from, to, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendTx({
                            from: from,
                            to: to,
                            value: new ethereumjs_util_1.BN(amount)
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Chain.prototype.sendTx = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3.eth.sendTransaction(__assign({ data: exports.EMPTY, gasLimit: '0x2dc6c0', timestamp: Date.now() }, args))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Chain;
}());
exports.Chain = Chain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2hhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrRUFBa0U7QUFDbEUsbURBQXFDO0FBR3JDLGVBQWU7QUFDZiw4REFBOEQ7QUFDOUQsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBY2hCLFFBQUEsS0FBSyxHQUFHLElBQUksQ0FBQztBQUUxQjtJQVlFLGVBQVksWUFBMEI7UUFDcEMsSUFBSSxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQVZtQixZQUFNLEdBQTFCOzs7Ozs7d0JBQ1EsS0FBSyxHQUFHLElBQUksMEJBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO3dCQUMvQyxxQkFBTSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUFsQixTQUFrQixDQUFDO3dCQUNiLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDN0IsSUFBQSx3QkFBTSxFQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNiLHNCQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFDOzs7O0tBQ3hCO0lBTVksOEJBQWMsR0FBM0IsVUFBNEIsSUFBWSxFQUFFLEdBQVc7Ozs7OzRCQUN4QyxxQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDOzRCQUMzQixJQUFJLEVBQUUsSUFBSTs0QkFDVixJQUFJLEVBQUUsR0FBRzt5QkFDVixDQUFDLEVBQUE7O3dCQUhJLEVBQUUsR0FBRyxTQUdUO3dCQUNGLHNCQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUM7Ozs7S0FDM0I7SUFFWSxtQ0FBbUIsR0FBaEMsVUFBaUMsSUFBWSxFQUFFLFFBQWdCLEVBQUUsR0FBNEIsRUFBRSxNQUFnQjs7Ozs0QkFDN0cscUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQzs0QkFDaEIsSUFBSSxNQUFBOzRCQUNKLEVBQUUsRUFBRSxRQUFROzRCQUNaLDhEQUE4RDs0QkFDOUQsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFVLEVBQUUsTUFBTSxDQUFDO3lCQUMvRCxDQUFDLEVBQUE7O3dCQUxGLFNBS0UsQ0FBQzs7Ozs7S0FDSjtJQUVZLG9DQUFvQixHQUFqQyxVQUFxQyxJQUFZLEVBQUUsUUFBZ0IsRUFBRSxHQUE0QixFQUFFLElBQVk7Ozs7Ozt3QkFDdEcsS0FBQSxDQUFBLEtBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFBLENBQUMsZUFBZSxDQUFBOzhCQUFDLElBQUk7d0JBQUUscUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO2dDQUN0RSxJQUFJLE1BQUE7Z0NBQ0osRUFBRSxFQUFFLFFBQVE7Z0NBQ1osOERBQThEO2dDQUM5RCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLEdBQVUsQ0FBQzs2QkFDekQsQ0FBQyxFQUFBOzRCQUxGLHNCQUFPLHdCQUF3QyxTQUs3QyxHQUFNLEVBQUM7Ozs7S0FDVjtJQUVZLHVCQUFPLEdBQXBCLFVBQXFCLElBQVksRUFBRSxFQUFVLEVBQUUsTUFBNEI7Ozs7NEJBQ3pFLHFCQUFNLElBQUksQ0FBQyxNQUFNLENBQUM7NEJBQ2hCLElBQUksTUFBQTs0QkFDSixFQUFFLElBQUE7NEJBQ0YsS0FBSyxFQUFFLElBQUksb0JBQUUsQ0FBQyxNQUFNLENBQUM7eUJBQ3RCLENBQUMsRUFBQTs7d0JBSkYsU0FJRSxDQUFDOzs7OztLQUNKO0lBRVksc0JBQU0sR0FBbkIsVUFBb0IsSUFFbkI7Ozs7NEJBQ1EscUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxZQUN4QyxJQUFJLEVBQUUsYUFBSyxFQUNYLFFBQVEsRUFBRSxVQUFVLEVBQ3BCLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQ2xCLElBQUksRUFDUCxFQUFBOzRCQUxGLHNCQUFPLFNBS0wsRUFBQzs7OztLQUNKO0lBRUgsWUFBQztBQUFELENBQUMsQUE3REQsSUE2REM7QUE3RFksc0JBQUsifQ==