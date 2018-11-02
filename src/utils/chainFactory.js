import Mock from './mock'
import Ethereum from './ethereum'


class ChainFactory {
  static async getChain() {
	switch(process.env.REACT_APP_SEMADA_DEMO_SEMADA_NETWORK) {
    case "ethereum":
        return new Ethereum()
    default:
        return new Mock()
	}
  }
}

export default ChainFactory
