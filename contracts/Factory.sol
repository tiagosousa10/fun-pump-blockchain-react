// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.27;

import {Token} from "./Token.sol";

contract Factory {
    uint256 public immutable fee;
    address public owner;

    uint256 public totalTokens;
    address[] public tokens;

    mapping(address => TokenSale) public tokenToSale; //

    struct TokenSale {
        address token;
        string name;
        address creator;
        uint256 sold;
        uint256 raised;
        bool isOpen;
    }

    event Created(address indexed token);
    event Buy(address indexed token, uint256 amount);

    constructor(uint256 _fee) {
        fee = _fee;
        owner = msg.sender;
    }

    function getTokenSale(
        uint256 _index
    ) public view returns (TokenSale memory) {
        return tokenToSale[tokens[_index]];
    }

    function getCost(uint256 _sold) public view returns (uint256) {
        uint256 floor = 0.0001 ether;
        uint256 step = 0.0001 ether;
        uint256 increment = 10000 ether;

        uint cost = (step * (_sold / increment)) + floor;
        return cost;
    }

    function create(
        string memory _name,
        string memory _symbol
    ) external payable {
        //make sure fee is correct
        require(msg.value >= fee, "Factory: Insufficient fee");

        //create a new token
        Token token = new Token(msg.sender, _name, _symbol, 1_000_000 ether);
        //save the token
        tokens.push(address(token));

        totalTokens++;
        //list the tooken for sale
        TokenSale memory sale = TokenSale(
            address(token),
            _name,
            msg.sender,
            0,
            0,
            true
        );

        tokenToSale[address(token)] = sale;

        //tell people its live
        emit Created(address(token));
    }

    function buy(address _token, uint256 _amount) external payable {
        TokenSale storage sale = tokenToSale[_token]; // extract the sale from the mapping by address of the token we want to buy

        //check conditions
        require(sale.isOpen == true, "Factory: Sale is closed");
        require(_amount >= 1 ether, "Factory: Insufficient amount");
        require(_amount <= 10000 ether, "Factory: Amount too large");

        //calculate the price of 1 token based upon total bought
        uint256 cost = getCost(sale.sold);
        uint256 price = cost * (_amount / 10 ** 18);

        //make sure enough ether is sent
        require(msg.value >= price, "Factory: Insufficient funds");

        //update the sale
        sale.sold = sale.sold + _amount;
        sale.raised = sale.raised + price;

        //make sure fund raising goal isn't met

        Token(_token).transfer(msg.sender, _amount);

        //emit an event
        emit Buy(_token, _amount);
    }
}
