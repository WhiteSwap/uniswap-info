import { SupportedNetwork } from 'constants/networks'

export interface GlobalNetworkState {
  chartData?: ChartDailyItem[]
  transactions?: Transactions
  dayTransactionCount: number
  price: number
}

export type GlobalState = Record<SupportedNetwork, GlobalNetworkState>

export type UpdateTransactionCountPayload = ParametersWithNetwork<{
  dayTransactionCount: number
}>

export type UpdateTransactionsPayload = ParametersWithNetwork<{
  transactions: Transactions
}>

export type UpdateChartPayload = ParametersWithNetwork<{
  data: ChartDailyItem[]
}>

export type UpdatePricePayload = ParametersWithNetwork<{
  price: number
}>
