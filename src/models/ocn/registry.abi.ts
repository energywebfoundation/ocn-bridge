export const registryABI = [
    {
        "constant": false,
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "isOwner",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes2"
            },
            {
                "name": "partyID",
                "type": "bytes3"
            },
            {
                "name": "newRoleAddress",
                "type": "address"
            },
            {
                "name": "newNodeURL",
                "type": "string"
            },
            {
                "name": "newNodeAddress",
                "type": "address"
            }
        ],
        "name": "adminOverwrite",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes2"
            },
            {
                "name": "partyID",
                "type": "bytes3"
            },
            {
                "name": "nodeURL",
                "type": "string"
            },
            {
                "name": "nodeAddress",
                "type": "address"
            },
            {
                "name": "v",
                "type": "uint8"
            },
            {
                "name": "r",
                "type": "bytes32"
            },
            {
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "register",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes2"
            },
            {
                "name": "partyID",
                "type": "bytes3"
            },
            {
                "name": "v",
                "type": "uint8"
            },
            {
                "name": "r",
                "type": "bytes32"
            },
            {
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "deregister",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes2"
            },
            {
                "name": "partyID",
                "type": "bytes3"
            },
            {
                "name": "newNodeURL",
                "type": "string"
            },
            {
                "name": "newNodeAddress",
                "type": "address"
            },
            {
                "name": "v",
                "type": "uint8"
            },
            {
                "name": "r",
                "type": "bytes32"
            },
            {
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "updateNodeInfo",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes2"
            },
            {
                "name": "partyID",
                "type": "bytes3"
            }
        ],
        "name": "partyAddressOf",
        "outputs": [
            {
                "name": "partyAddress",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes2"
            },
            {
                "name": "partyID",
                "type": "bytes3"
            }
        ],
        "name": "nodeURLOf",
        "outputs": [
            {
                "name": "nodeURL",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes2"
            },
            {
                "name": "partyID",
                "type": "bytes3"
            }
        ],
        "name": "nodeAddressOf",
        "outputs": [
            {
                "name": "nodeAddress",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]
