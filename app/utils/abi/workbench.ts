export const WORKBENCH_ADDRESS = "0xd2D0bc77cd8B05Bf0b7482Aac72af141F3D54056";

export const WORKBENCH_ABI = [
  {
    inputs: [
      {
        internalType: "contract Collection",
        name: "collectionAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "blueprintId",
        type: "uint256",
      },
    ],
    name: "BlueprintAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "blueprintId",
        type: "uint256",
      },
    ],
    name: "BlueprintNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidBlueprintParams",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "blueprintId",
        type: "uint256",
      },
    ],
    name: "BlueprintCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "blueprintId",
        type: "uint256",
      },
    ],
    name: "BlueprintDeleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "blueprintId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "outputIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "outputAmounts",
        type: "uint256[]",
      },
    ],
    name: "Crafted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "collection",
    outputs: [
      {
        internalType: "contract Collection",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "blueprintId",
        type: "uint256",
      },
    ],
    name: "craft",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "inputIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "inputAmounts",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "outputIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "outputAmounts",
        type: "uint256[]",
      },
    ],
    name: "createBlueprint",
    outputs: [
      {
        internalType: "uint256",
        name: "newBlueprintId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "blueprintId",
        type: "uint256",
      },
    ],
    name: "deleteBlueprint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "inputIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "inputAmounts",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "outputIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "outputAmounts",
        type: "uint256[]",
      },
    ],
    name: "hashBlueprint",
    outputs: [
      {
        internalType: "uint256",
        name: "blueprintId",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
