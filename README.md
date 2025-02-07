# BrickMark BMT Token

BrickMark smart contracts.

Best practice: https://consensys.github.io/smart-contract-best-practices/

## Questions to clarify

- Writeable functions such as update roles are still active in state freeze and paused. What todo?

**to-dos**
- Adjust migrations script for Rinkeby and Main-net deployment
- Deployment to Rinkeby
- End2End Test Scenario with Gnosis MultiSig
- KeyManagement BrickMark

## Requirements

Following tools are required:

- Truffle
- NPM
- Ganache-cli

The first time you checkout the project run a `npm install`. To use all functionalities have a look into the `package.json` file. Several tools are globally installed.  

### Security scan

We are using MythX for security scans: https://docs.mythx.io/en/latest/tools/truffle/

`npm run security`

```bash
# Create a file mythx-accounts.sh

#!/bin/bash
export MYTHX_ETH_ADDRESS='<ETH ADDRESS>'
export MYTHX_PASSWORD='<PASSWORD>'
```

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


## Gnosis Multi-Sig (Safe)

Gnosis Safe (new Gnosis)

Rinkeby: https://rinkeby.gnosis-safe.io

Localhost: https://github.com/gnosis/safe-react
```bash
npm install -g serve
<blockquote>export REACT_APP_ENV=production
export REACT_APP_NETWORK=mainnet
yarn build
serve -s build_webpack -l 9000
</blockquote>go to <a href="http://localhost:9000" class="link">http://localhost:9000</a>
```

### Loading ABI
It’s not yet possible to load an ABI right in the interface. But here is a tutorial on how to use the “Custom Transaction” feature in the Safe Multisig: https://docs.google.com/document/d/1z3WGxMvycNzJGKvWSVaMhoZaLcwKlDjD5rE_PvKPfYs/mobilebasic