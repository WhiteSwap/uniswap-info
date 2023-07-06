import { SupportedNetwork } from 'constants/networks'

export default {
  [SupportedNetwork.ETHEREUM]: process.env.REACT_APP_ETHEREUM_API,
  [SupportedNetwork.TRON]: process.env.REACT_APP_TRON_API
}
