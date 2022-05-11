export type MappedToken = {
  id: string
  name: string
  symbol: string
  derived: number
  tradeVolume: string
  tradeVolumeUSD: number
  untrackedVolumeUSD: number
  totalLiquidity: number
  txCount: number
  priceUSD: number
  totalLiquidityUSD: number
  oneDayVolumeUT: number
  volumeChangeUT: number
  oneDayVolumeUSD: number
  volumeChangeUSD: number
  priceChangeUSD: number
  liquidityChangeUSD: number
  oneDayTxns: number
  txnChange: number
  __typename: string
}

export type MappedTokenDayData = {
  id: string
  date: number | string
  priceUSD: string
  totalLiquidityToken: string
  totalLiquidityUSD: string
  totalLiquidityCoin: string
  dailyVolumeCoin: string
  dailyVolumeToken: string
  dailyVolumeUSD: number
  __typename: string
}
