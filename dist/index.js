"use strict";
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
var chain_1 = require("./chain");
var deployContract_1 = require("./deployContract");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var web3, acc1, contractAddr, abi, _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, (0, chain_1.init)()];
            case 1:
                _f.sent();
                web3 = (0, chain_1.web3Instance)();
                return [4 /*yield*/, web3.eth.getAccounts()];
            case 2:
                acc1 = (_f.sent())[0];
                return [4 /*yield*/, (0, deployContract_1["default"])(acc1, 
                    // eslint-disable-next-line max-len
                    '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100d9565b60405180910390f35b610073600480360381019061006e919061009d565b61007e565b005b60008054905090565b8060008190555050565b60008135905061009781610103565b92915050565b6000602082840312156100b3576100b26100fe565b5b60006100c184828501610088565b91505092915050565b6100d3816100f4565b82525050565b60006020820190506100ee60008301846100ca565b92915050565b6000819050919050565b600080fd5b61010c816100f4565b811461011757600080fd5b5056fea2646970667358221220404e37f487a89a932dca5e77faaf6ca2de3b991f93d230604b1b8daaef64766264736f6c63430008070033')];
            case 3:
                contractAddr = _f.sent();
                abi = [
                    {
                        'inputs': [
                            {
                                'internalType': 'uint256',
                                'name': 'num',
                                'type': 'uint256'
                            }
                        ],
                        'name': 'store',
                        'outputs': [],
                        'stateMutability': 'nonpayable',
                        'type': 'function'
                    },
                    {
                        'inputs': [],
                        'name': 'retrieve',
                        'outputs': [
                            {
                                'internalType': 'uint256',
                                'name': '',
                                'type': 'uint256'
                            }
                        ],
                        'stateMutability': 'view',
                        'type': 'function'
                    }
                ];
                return [4 /*yield*/, (0, chain_1.sendTx)({
                        from: acc1,
                        to: contractAddr,
                        data: web3.eth.abi.encodeFunctionCall(abi[0], ['22'])
                    })];
            case 4:
                _f.sent();
                _b = (_a = console).log;
                _d = (_c = web3.eth.abi).decodeParameter;
                _e = ['uint256'];
                return [4 /*yield*/, web3.eth.call({
                        from: acc1,
                        to: contractAddr,
                        data: web3.eth.abi.encodeEventSignature(abi[1])
                    })];
            case 5:
                _b.apply(_a, [_d.apply(_c, _e.concat([_f.sent()]))]);
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQ0FBcUQ7QUFDckQsbURBQThDO0FBRTlDLENBQUM7Ozs7b0JBQ0MscUJBQU0sSUFBQSxZQUFJLEdBQUUsRUFBQTs7Z0JBQVosU0FBWSxDQUFDO2dCQUNQLElBQUksR0FBRyxJQUFBLG9CQUFZLEdBQUUsQ0FBQztnQkFFYixxQkFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFBOztnQkFBcEMsSUFBSSxHQUFJLENBQUEsU0FBNEIsQ0FBQSxHQUFoQztnQkFFVSxxQkFBTSxJQUFBLDJCQUFjLEVBQUMsSUFBSTtvQkFDNUMsbUNBQW1DO29CQUNuQyxvdUJBQW91QixDQUNydUIsRUFBQTs7Z0JBSEssWUFBWSxHQUFHLFNBR3BCO2dCQUVLLEdBQUcsR0FBRztvQkFDVjt3QkFDRSxRQUFRLEVBQUU7NEJBQ1I7Z0NBQ0UsY0FBYyxFQUFFLFNBQVM7Z0NBQ3pCLE1BQU0sRUFBRSxLQUFLO2dDQUNiLE1BQU0sRUFBRSxTQUFTOzZCQUNsQjt5QkFDRjt3QkFDRCxNQUFNLEVBQUUsT0FBTzt3QkFDZixTQUFTLEVBQUUsRUFBRTt3QkFDYixpQkFBaUIsRUFBRSxZQUFZO3dCQUMvQixNQUFNLEVBQUUsVUFBVTtxQkFDbkI7b0JBQ0Q7d0JBQ0UsUUFBUSxFQUFFLEVBQUU7d0JBQ1osTUFBTSxFQUFFLFVBQVU7d0JBQ2xCLFNBQVMsRUFBRTs0QkFDVDtnQ0FDRSxjQUFjLEVBQUUsU0FBUztnQ0FDekIsTUFBTSxFQUFFLEVBQUU7Z0NBQ1YsTUFBTSxFQUFFLFNBQVM7NkJBQ2xCO3lCQUNGO3dCQUNELGlCQUFpQixFQUFFLE1BQU07d0JBQ3pCLE1BQU0sRUFBRSxVQUFVO3FCQUNuQjtpQkFDRixDQUFDO2dCQUVGLHFCQUFNLElBQUEsY0FBTSxFQUFDO3dCQUNYLElBQUksRUFBRSxJQUFJO3dCQUNWLEVBQUUsRUFBRSxZQUFZO3dCQUNoQixJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBUSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQzdELENBQUMsRUFBQTs7Z0JBSkYsU0FJRSxDQUFDO2dCQUVILEtBQUEsQ0FBQSxLQUFBLE9BQU8sQ0FBQSxDQUFDLEdBQUcsQ0FBQTtnQkFBQyxLQUFBLENBQUEsS0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQSxDQUFDLGVBQWUsQ0FBQTtzQkFBQyxTQUFTO2dCQUFFLHFCQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO3dCQUN0RSxJQUFJLEVBQUUsSUFBSTt3QkFDVixFQUFFLEVBQUUsWUFBWTt3QkFDaEIsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQVEsQ0FBQztxQkFDdkQsQ0FBQyxFQUFBOztnQkFKRixjQUFZLHdCQUF3QyxTQUlsRCxHQUFDLEVBQUMsQ0FBQzs7OztLQUdOLENBQUMsRUFBRSxDQUFDIn0=