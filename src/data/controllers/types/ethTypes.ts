export type EthereumToken = {
  id: string
  name: string
  symbol: string
  derivedETH: number
  liquidityChangeUSD: number
  oneDayTxns: number
  oneDayVolumeUSD: number
  oneDayVolumeUT: number
  priceChangeUSD: number
  priceUSD: number
  totalLiquidity: number
  totalLiquidityUSD: number
  tradeVolume: number
  tradeVolumeUSD: number
  txCount: number
  txnChange: number
  untrackedVolumeUSD: number
  volumeChangeUSD: number
  volumeChangeUT: number
  __typename?: string
}

export type EthereumPairToken = Pick<EthereumToken, 'derivedETH' | 'id' | 'name' | 'symbol' | 'totalLiquidity'>

export type EthereumPair = {
  createdAtTimestamp: string
  id: string
  liquidityChangeUSD: number
  oneDayVolumeUSD: number
  oneDayVolumeUntracked: number
  oneWeekVolumeUSD: number
  reserve0: string
  reserve1: string
  reserveUSD: string
  token0Price: string
  token1Price: string
  totalSupply: string
  trackedReserveUSD: number
  untrackedVolumeUSD: string
  volumeChangeUSD: number
  volumeChangeUntracked: number
  volumeUSD: string
  trackedReserveETH: string
  token0: EthereumPairToken
  token1: EthereumPairToken
  __typename?: string
}

export type EthereumTokenDayData = Omit<TokenDayData, 'dailyVolumeCoin' | 'totalLiquidityCoin'> & {
  dailyVolumeETH?: string
  totalLiquidityETH?: string
}
