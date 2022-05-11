export type MappedPairToken = {
  id: string
  symbol: string
  name: string
  totalLiquidity: number
  derivedCoin: number
  __typename: string
}

export type MappedPair = {
  id: string
  token0: MappedPairToken
  token1: MappedPairToken
  reserve0: string
  reserve1: string
  reserveUSD: string
  totalSupply: string
  trackedReserveCoin: string
  volumeUSD: string
  untrackedVolumeUSD: string
  token0Price: string
  token1Price: string
  createdAtTimestamp: string
  oneDayVolumeUSD: number
  oneWeekVolumeUSD: number
  volumeChangeUSD: number
  oneDayVolumeUntracked: number
  volumeChangeUntracked: number
  trackedReserveUSD: number
  liquidityChangeUSD: number
  __typename: string
}
