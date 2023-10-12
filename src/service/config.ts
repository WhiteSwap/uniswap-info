import { SupportedNetwork } from 'constants/networks'

export default {
  [SupportedNetwork.ETHEREUM]: process.env.REACT_APP_ETHEREUM_GRAPH,
  [SupportedNetwork.POLYGON]: process.env.REACT_APP_POLYGON_GRAPH,
  [SupportedNetwork.TRON]: process.env.REACT_APP_TRON_GRAPH
}
