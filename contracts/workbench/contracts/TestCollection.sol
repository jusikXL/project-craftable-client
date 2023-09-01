// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Collection.sol";

contract TestCollection is Collection {
    constructor() Collection() {}

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override {
        _mintBatch(to, ids, amounts, data);
    }
}
