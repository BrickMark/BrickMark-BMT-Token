# BrickMark BMT Token

BrickMark smart contracts.

Best practice: https://consensys.github.io/smart-contract-best-practices/

## Requirements

Following tools are required:

- Truffle
- NPM
- Ganache-cli

The first time you checkout the project run a `npm install`.

## Smart Contract

It's a truffle project managed with npm. Have a look at `package.json` to see the supported commands.

```bash
# Ganache CLI is required
# You can start it with a specific mnemonic
# You can use an other one too. If you use MetaMask make sure you initialize MM with the same Mnemonic
npm run ganache

# Test the smart contracts
truffle test

# Deploy the smart contracts
truffle deploy


# Retrieve the addresses from deployed contracts
truffle networks
```

## Deployment to Rinkeby

Checkout `truffle-config.js`

```bash
# Deploy to the 'rinkeby' network
# Set your private key in the 'truffle-config.js' file
truffle deploy --network rinkeby
```