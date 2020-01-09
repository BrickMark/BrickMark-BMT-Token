# token-manager

## Project setup
```
npm install
```

## Local Setup
```
# 1.) Init Ganache 
../
npm run ganache

# 2.) Setup smart contracts
truffle test test-ui/UI-SetupTest.js

# 3.) Ready for UI Testing
npm run serve

# 4.) Metamask. 
# Initialize MetaMask with the same seed as ganache. See parents package.json

npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
