# BrickMark BMT Token

BrickMark smart contracts.

Best practice: https://consensys.github.io/smart-contract-best-practices/

## Qestions to clarify

- Vested: Mint can still mint to vested address. Should be allowed or not?
- Vested: PayDividend can still mint to vested address. Should be allowed or not?
- Vested: How long will be accounts vested?
- Dividend: When will the first dividend be payed?
- Paused: Should mint still be allowed
- Freezed: Nothing allowed anymore
- MinterRole / PauserRole: Really necessary? Or would "owner" be good enough? Separation of concern.

### TODO
- Design a state machine

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