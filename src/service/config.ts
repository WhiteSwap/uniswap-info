import { SupportedNetwork } from 'constants/networks'

export default {
  [SupportedNetwork.ETHEREUM]: import.meta.env.VITE_APP_ETHEREUM_GRAPH,
  [SupportedNetwork.POLYGON]: import.meta.env.VITE_APP_POLYGON_GRAPH,
  [SupportedNetwork.TRON]: import.meta.env.VITE_APP_TRON_GRAPH
}
