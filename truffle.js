var HDWalletProvider = require("truffle-hdwallet-provider")
var mnemonic = 
  "lunar beach clip bulk analyst magnet luxury project arm grab margin summer"
/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  networks: {
    development: {
      host: "localhost", 
      port: 8545,
      network_id: "999" 
    },  
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic, 
          "https://rinkeby.infura.io/v3/3cc28b2c77844240877db11af5f376cd")
      },
      network_id: 4
    }   
  }
};

