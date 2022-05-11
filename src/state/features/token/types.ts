import { MappedToken, MappedTokenDayData } from 'data/mappers/tokenMappers.types'

export interface TokenDetails extends MappedToken {
  transactions?: Transactions
  chartData?: MappedTokenDayData[]
  tokenPairs?: string[]
  timeWindowData?: Record<string, Record<string, TimeWindowItem[]>>
}

export type TokenDayData = {
  dailyVolumeETH?: string
  dailyVolumeToken?: string
  dailyVolumeUSD: number
  date: number
  id?: string
  priceUSD: string
  totalLiquidityETH?: string
  totalLiquidityToken?: string
  totalLiquidityUSD: string
  dayString?: number
}

export type TokenState = Record<SupportedNetwork, Record<string, TokenDetails>>

export type UpdateTokenPayload = ParamsWithNetwork<{
  tokenAddress: string
  data: MappedToken
}>

export type UpdateTopTokensPayload = ParamsWithNetwork<{
  topTokens: MappedToken[]
}>

export type UpdateTransactionsPayload = ParamsWithNetwork<{
  address: string
  transactions: Transactions
}>

export type UpdateChartDataPayload = ParamsWithNetwork<{
  address: string
  chartData: MappedTokenDayData[]
}>

export type UpdatePriceDataPayload = ParamsWithNetwork<{
  address: string
  data: TimeWindowItem[]
  timeWindow: string
  interval: number
}>

export type UpdateAllPairsPayload = ParamsWithNetwork<{
  address: string
  allPairs: string[]
}>
