import SemadaApi from './semada-api'
import SemadaMemory from './semada-memory'
// import SemadaEthereum from './semada-ethereum'


class SemadaCoreFactory {
  static async getPersistenceLayer() {
	switch(process.env.REACT_APP_SEMADA_DEMO_SEMADA_NETWORK) {
    case "semada-ethereum":
      return new SemadaEthereum()
    case "semada-api":
      return SemadaApi
    default:
      return SemadaMemory
	}
  }
}

export default SemadaCoreFactory
