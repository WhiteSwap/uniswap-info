export type PairsState = Record<SupportedNetwork, Record<string, PairDetails>>

export interface PairDetails extends Pair {
  chartData?: PairDayData[]
  timeWindowData?: Record<string, Record<string, TimeWindowItem[]>>
  txns?: Transactions
}

export interface PairDayData {
  dailyVolumeUSD: number
  date: number
  reserveUSD: number
}

export type UpdatePairPayload = ParametersWithNetwork<{
  pairAddress: string
  data: Pair
}>

export type UpdateTopPairsPayload = ParametersWithNetwork<{
  topPairs: Pair[]
}>

export type UpdatePairTransactionsPayload = ParametersWithNetwork<{
  address: string
  transactions: Transactions
}>

export type UpdateChartDataPayload = ParametersWithNetwork<{
  address: string
  chartData: PairDayData[]
}>

export type UpdateHourlyDataPayload = ParametersWithNetwork<{
  address: string
  hourlyData: Record<string, TimeWindowItem[]>
  timeWindow: string
}>
