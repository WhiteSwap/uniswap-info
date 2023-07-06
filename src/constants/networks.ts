import ETHEREUM_LOGO_URL from 'assets/eth.png'
import TRON_LOGO_URL from 'assets/tron.svg'

export enum SupportedNetwork {
  ETHEREUM = 'eth',
  TRON = 'trx'
}

export interface NetworkInfo {
  id: SupportedNetwork
  route: string
  name: string
  imageURL: string
  bgColor: string
  primaryColor: string
  secondaryColor: string
  chainId?: number
  blurb?: string
  networkUrlPrefix: string
  headingTitle: string
}

export const EthereumNetworkInfo: NetworkInfo = {
  id: SupportedNetwork.ETHEREUM,
  route: 'eth',
  name: 'Ethereum',
  imageURL: ETHEREUM_LOGO_URL,
  bgColor: '#fc077d',
  primaryColor: '#607BEE',
  secondaryColor: '#2172E5',
  chainId: 1,
  networkUrlPrefix: 'mainnet',
  headingTitle: 'Ethereum'
}

export const TronNetworkInfo: NetworkInfo = {
  id: SupportedNetwork.TRON,
  route: 'trx',
  name: 'Tron',
  imageURL: TRON_LOGO_URL,
  bgColor: '#0A294B',
  primaryColor: '#F45670',
  secondaryColor: '#96BEDC',
  blurb: 'Beta',
  networkUrlPrefix: 'mainnet',
  headingTitle: 'TRON (TRX)'
}

export const SUPPORTED_NETWORK_VERSIONS: NetworkInfo[] = [EthereumNetworkInfo, TronNetworkInfo]
