// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Storage {
    uint256 number;

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function store(uint256 num) public returns (uint256) {
        number = num;
        return num;
    }

    /**
     * @dev Return value
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256, bool) {
        return (number, true);
    }

    function retrieve2(bool b) public view returns (uint256) {
        return number;
    }

    function retrieve3(bool b) public view returns (uint256) {
        return number;
    }
}
