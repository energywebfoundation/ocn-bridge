/*
    Copyright 2019-2020 eMobilify GmbH

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
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
