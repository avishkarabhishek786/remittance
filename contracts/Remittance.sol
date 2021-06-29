// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./Stoppable.sol";
import "./Address.sol";
import "./IUSM.sol";

//import "hardhat/console.sol";

contract Remittance is Stoppable {

    using Address for address payable;

    IUSM usdao;

    struct RemitDetails {
        address remitCreator; // To store the remit initiator's address
        uint256 amount; // For storing the amount of Remit
        uint256 deadline; // To store in seconds from the current time for the claim back to start
        bool exists;
    }

    mapping (address => uint256) public balances; // To store the contract owner & exchange owner balance
    mapping (bytes32 => RemitDetails) public remittances;

    event Remit(bytes32 indexed hashValue, address indexed remitCreator, uint256 value);
    event Withdrawed(address indexed to, uint256 value);
    event Exchange(bytes32 indexed hashValue, address indexed exchanger, uint256 value);
    event ClaimBack(bytes32 indexed hashValue, address indexed remitCreator, uint256 value);

    constructor(IUSM _usdao, bool initialRunState) Stoppable(initialRunState) {
        usdao = IUSM(_usdao);
    }

    function encrypt(bytes32 userSecret, address exchangerAddress) public view returns(bytes32 password){

        require(exchangerAddress != address(0), "Exchanger address should be a valid address");
        return keccak256(abi.encodePacked(userSecret, exchangerAddress, address(this)));

    }

    function remit(bytes32 hashValue, uint256 second, uint256 remittance_amount) public onlyIfRunning returns(bool status){

        // Check if remit with this hash is already created
        require(!remittances[hashValue].exists, "Remittance already exists.");

        // The hashValue should be unique
        require(remittances[hashValue].remitCreator == address(0), "The hashValue should be unique");

        // Minimum 1 wei should be sent.
        require(remittance_amount > 0, "Amount should be atleast 1 wei USDAO");

        // Check contract balance
        require(usdao.balanceOf(address(this))>=remittance_amount, "Insufficient balance.");

        // Details of Receiver is updated
        remittances[hashValue].amount = remittance_amount;
        remittances[hashValue].remitCreator = msg.sender;
        remittances[hashValue].deadline = block.timestamp+second;
        remittances[hashValue].exists = true;

        // todo: We can also add exchager address and txid of usdao sent to the contract in
        // the above struct 

        emit Remit(hashValue, msg.sender, remittance_amount);

        return true;

    }

    function exchange(bytes32 userSecret) public onlyIfRunning returns(bool status){

        bytes32 hashValue = encrypt(userSecret, msg.sender);

        uint userBalance = remittances[hashValue].amount;

        // This is to check whether the deadline is passed and Remit Creator has taken the exchange amount back
        require(userBalance > 0, "Remittance Completed/Claimed Back.");

        // As User receives fiat from Exchanger, User's balance is changed to zero
        // And Exchanger's balance is updated. Here we have updated considering that carol can be doing multiple exchanges as well
        remittances[hashValue].amount = 0;
        remittances[hashValue].deadline = 0; // To shrink the data use
        balances[msg.sender] = balances[msg.sender]+userBalance;

        emit Exchange(hashValue, msg.sender, userBalance);
        return true;

    }

    function withdraw(uint256 amount) public onlyIfRunning returns(bool status){

        require(amount > 0, "Zero cant be withdrawn");

        uint balance = balances[msg.sender];
        
        require(balance >= amount, "Withdraw amount requested higher than balance");
        
        balances[msg.sender] = balance-amount;

        emit Withdrawed(msg.sender, amount);

        // Transfer USDAO from this contract to the Exchanger
        require(usdao.transfer(address(msg.sender), amount), "USDAO withdraw failed.");

        return true;

    }

    function claimBack(bytes32 hashValue) public onlyIfRunning returns(bool status){

        // Only the Remit Creator should be allowed to claim back
        require(remittances[hashValue].remitCreator == msg.sender, "Only Remit Creator can claim back");

        // This is to stop further checks if the exchange is already complete
        uint256 amount = remittances[hashValue].amount;
        require(amount > 0, "Exchange is already complete");

        // The claim period should start
        require(remittances[hashValue].deadline < block.timestamp, "Claim Period has not started yet");

        remittances[hashValue].amount = 0;
        remittances[hashValue].deadline = 0; // To shrink the data use

        emit ClaimBack(hashValue, msg.sender, amount);

        // Transfer USDAO from this contract to the Exchanger
        require(usdao.transfer(address(msg.sender), amount), "USDAO claim back failed.");

        return true;

    }

}
