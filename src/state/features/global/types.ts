import { SupportedNetwork } from 'constants/networks'

export interface GlobalNetworkState {
  chartData?: ChartDailyItem[]
  transactions?: Transactions
  dayTransactionCount: number
  price: number
  oneDayPrice: number
  priceChange: number
}

export type GlobalState = Record<SupportedNetwork, GlobalNetworkState>

export type UpdateTransactionCountPayload = ParamsWithNetwork<{
  dayTransactionCount: number
}>

export type UpdateTransactionsPayload = ParamsWithNetwork<{
  transactions: Transactions
}>

export type UpdateChartPayload = ParamsWithNetwork<{
  data: ChartDailyItem[]
}>

export type UpdatePricePayload = ParamsWithNetwork<{
  price: number
  oneDayPrice: number
  priceChange: number
}>
