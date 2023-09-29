import EthereumLogo from 'assets/eth.svg'
import PolygonLogo from 'assets/polygon.svg'
import TronLogo from 'assets/tron.svg'

export enum SupportedNetwork {
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  TRON = 'tron'
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
  headingTitle: string
  dexUrlPrefix: string
  coinSymbol: string
}

export const EthereumNetworkInfo: NetworkInfo = {
  id: SupportedNetwork.ETHEREUM,
  route: 'ethereum',
  name: 'Ethereum',
  imageURL: EthereumLogo,
  bgColor: '#fc077d',
  primaryColor: '#607BEE',
  secondaryColor: '#2172E5',
  chainId: 1,
  headingTitle: 'Ethereum',
  dexUrlPrefix: 'eth/mainnet',
  coinSymbol: 'ETH'
}

export const PolygonNetworkInfo: NetworkInfo = {
  id: SupportedNetwork.POLYGON,
  route: 'polygon',
  name: 'Polygon',
  imageURL: PolygonLogo,
  bgColor: '#0A294B',
  primaryColor: '#8247e5',
  secondaryColor: '#A625C0',
  chainId: 137,
  headingTitle: 'Polygon',
  dexUrlPrefix: 'eth/polygon',
  coinSymbol: 'MATIC'
}

export const TronNetworkInfo: NetworkInfo = {
  id: SupportedNetwork.TRON,
  route: 'tron',
  name: 'Tron',
  imageURL: TronLogo,
  bgColor: '#0A294B',
  primaryColor: '#F45670',
  secondaryColor: '#96BEDC',
  headingTitle: 'TRON (TRX)',
  dexUrlPrefix: 'trx/mainnet',
  coinSymbol: 'TRX'
}

export const SUPPORTED_NETWORK_VERSIONS: NetworkInfo[] = [EthereumNetworkInfo, PolygonNetworkInfo, TronNetworkInfo]

export const SUPPORTED_NETWORK_INFOS: { [key in SupportedNetwork]: NetworkInfo } = {
  [SupportedNetwork.ETHEREUM]: EthereumNetworkInfo,
  [SupportedNetwork.POLYGON]: PolygonNetworkInfo,
  [SupportedNetwork.TRON]: TronNetworkInfo
}
