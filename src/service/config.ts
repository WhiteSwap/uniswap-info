import { SupportedNetwork } from 'constants/networks'

export default {
  [SupportedNetwork.ETHEREUM]: import.meta.env.VITE_ETHEREUM_GRAPH,
  [SupportedNetwork.POLYGON]: import.meta.env.VITE_POLYGON_GRAPH,
  [SupportedNetwork.WHITECHAIN]: import.meta.env.VITE_WHITECHAIN_GRAPH,
  [SupportedNetwork.TRON]: import.meta.env.VITE_TRON_GRAPH
}
