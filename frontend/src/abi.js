export const Remittance = {
    name: 'Remittance',
    // abi: [
    //     "function encrypt(bytes32 userSecret, address exchangerAddress) public view returns(bytes32 password)",
    //     "function remit(bytes32 hashValue, uint256 second, uint256 remittance_amount) public returns(bool status)",
    //     "function exchange(bytes32 userSecret) public returns(bool status)",
    //     "function withdraw(uint256 amount) public returns(bool status)",
    //     "function claimBack(bytes32 hashValue) public returns(bool status)"
    // ],
    "abi": [
        {
          "inputs": [
            {
              "internalType": "contract IUSM",
              "name": "_usdao",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "initialRunState",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "hashValue",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "remitCreator",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "ClaimBack",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "hashValue",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "exchanger",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Exchange",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            }
          ],
          "name": "LogPausedContract",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            }
          ],
          "name": "LogResumedContract",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            }
          ],
          "name": "LogStoppedContract",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "hashValue",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "remitCreator",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Remit",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Withdrawed",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "balances",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "hashValue",
              "type": "bytes32"
            }
          ],
          "name": "claimBack",
          "outputs": [
            {
              "internalType": "bool",
              "name": "status",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "userSecret",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "exchangerAddress",
              "type": "address"
            }
          ],
          "name": "encrypt",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "password",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "userSecret",
              "type": "bytes32"
            }
          ],
          "name": "exchange",
          "outputs": [
            {
              "internalType": "bool",
              "name": "status",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "pauseContract",
          "outputs": [
            {
              "internalType": "bool",
              "name": "success",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "hashValue",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "second",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "remittance_amount",
              "type": "uint256"
            }
          ],
          "name": "remit",
          "outputs": [
            {
              "internalType": "bool",
              "name": "status",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "name": "remittances",
          "outputs": [
            {
              "internalType": "address",
              "name": "remitCreator",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "exists",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "resumeContract",
          "outputs": [
            {
              "internalType": "bool",
              "name": "success",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "stopContract",
          "outputs": [
            {
              "internalType": "bool",
              "name": "success",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "withdraw",
          "outputs": [
            {
              "internalType": "bool",
              "name": "status",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
    
    address: {
        1: '',
        42: '0xd9F05ef1E7EEa7ac0941c27574d4eD7cfd376Dd0',
        31337: '',
        1337: ''
    }    
} 

export const USDAO = {
    name:'USDAO',
    abi: [
        "function balanceOf(address account) external view returns (uint256)"
    ],
    address: {
        42: '0x3280b0b8f147bc0e03f1a8eb462edcb77a0635fe'
    }
} 