"use strict";
exports.__esModule = true;
exports.privateKeyToAddress = void 0;
var ethereumjs_util_1 = require("ethereumjs-util");
function privateKeyToAddress(privateKey) {
    return '0x' + (0, ethereumjs_util_1.privateToAddress)(Buffer.from(privateKey.replace('0x', ''), 'hex')).toString('hex');
}
exports.privateKeyToAddress = privateKeyToAddress;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUFtRDtBQUVuRCxTQUFnQixtQkFBbUIsQ0FBQyxVQUFrQjtJQUNwRCxPQUFPLElBQUksR0FBRyxJQUFBLGtDQUFnQixFQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkcsQ0FBQztBQUZELGtEQUVDIn0=