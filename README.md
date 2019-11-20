# BrickMark BMT Token

BrickMark smart contracts.

Best practice: https://consensys.github.io/smart-contract-best-practices/

## Questions to clarify

- Writeable functions such as update roles are still active in state freeze and paused. What todo?
- How long is a voting? What's the max duration? 100 days

**Voting questions and todos**
- All state changes should emit an event
- MultiSig test
- Event VoteFor test for vote, transfer and transferFrom function
- Coverage of emitted events in general quiet low
- Helper Class for time options
- Deployment to Rinkeby
- Test Frontend
- End2End Test Scenario with Gnosis MultiSig


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

## Testing

Using https://www.npmjs.com/package/truffle-assertions