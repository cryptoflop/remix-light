// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Test {
    string private test;
    bool private testib;

    constructor(string memory testValue, bool testi) {
        test = testValue;
        testib = testi;
    }

    function retrieve() public view returns (string memory) {
        return test;
    }
}
