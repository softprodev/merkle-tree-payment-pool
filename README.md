# Merkle-Tree Payment Pool

This is an implementation of a Merkle Tree based payment pool in Solidity. This project was inspired by this Ethereum research post: https://ethresear.ch/t/pooled-payments-scaling-solution-for-one-to-many-transactions/590. A longer description around the motivations behind this project is available here: ***TODO: Add medium post URL here***. This project includes a payment pool smart contract that leverages Merkle Trees. Also included is a JS lib to create Merkle Trees, derive Merkle roots, and Merkle proofs that have metadata attached to the proofs that aid this smart contract in managing the payment pool. 

The key feature behind this payment pool, is that by using a Merkle tree to represent the list of payees and their payment amounts, we can specify arbitrarily large amounts of payees and their payment amounts simply by specifying a 32 byte Merkle root of a Merkle tree that represents the payee list. Payees can then withdraw their payments by providing the payment pool with the Merkle proof associated with the payee. This solution does rely on an off-chain mechanism to derive the Merkle tree for each payment cycle, as well as to publish the Merkle proofs for the payees in manner that payees can easily discover their proofs (e.g. IPFS).

## How It Works
The way this payment pool works is that for each *payment cycle* the contract owner derives a Merkle tree for 
