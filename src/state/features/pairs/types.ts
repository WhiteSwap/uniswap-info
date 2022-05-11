import { MappedPair } from 'data/mappers/pairMappers.types'

export type PairsState = Record<SupportedNetwork, Record<string, PairDetails>>

export interface PairDetails extends MappedPair {
  chartData?: PairDayData[]
  timeWindowData?: TimeWindowData
  txns?: Transactions
}

export interface PairDayData {
  dailyVolumeToken0?: string
  dailyVolumeToken1?: string
  dailyVolumeUSD: number
  date: number
  dayString?: number
  reserveUSD: number
}

export type UpdatePairPayload = ParamsWithNetwork<{
  pairAddress: string
  data: MappedPair
}>

export type UpdateTopPairsPayload = ParamsWithNetwork<{
  topPairs: MappedPair[]
}>

export type UpdatePairTransactionsPayload = ParamsWithNetwork<{
  address: string
  transactions: Transactions
}>

export type UpdateChartDataPayload = ParamsWithNetwork<{
  address: string
  chartData: PairDayData[]
}>

export type UpdateHourlyDataPayload = ParamsWithNetwork<{
  address: string
  hourlyData: TimeWindowItem[][]
  timeWindow: string
}>
