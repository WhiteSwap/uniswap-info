import { SupportedNetwork } from 'constants/networks'

export interface Account {
  positions: Position[]
  transactions: Transactions
  liquiditySnapshots: LiquiditySnapshot[]
  liquidityChartData: Record<string, LiquidityChart[]>
  positionChartData: Record<string, Record<string, PairReturn[]>>
}

export type AccountNetworkState = {
  topLiquidityPositions?: Array<LiquidityPosition>
  byAddress: Record<string, Account>
}

export type LiquidityChart = {
  date: number
  value: number
}

export type AccountState = Record<SupportedNetwork, AccountNetworkState>

export type UpdateTransactionsPayload = ParametersWithNetwork<{
  account: string
  transactions: Transactions
}>

export type UpdatePositionsPayload = ParametersWithNetwork<{
  account: string
  positions: Position[]
}>

export type UpdateLiquidityChartDataPayload = ParametersWithNetwork<{
  account: string
  data: Record<string, LiquidityChart[]>
}>

export type UpdatePositionHistoryPayload = ParametersWithNetwork<{
  account: string
  historyData: LiquiditySnapshot[]
}>

export type UpdatePairReturnsPayload = ParametersWithNetwork<{
  account: string
  pairAddress: string
  data: Record<string, PairReturn[]>
}>

export type UpdateTopLiquidityPositionsPayload = ParametersWithNetwork<{
  liquidityPositions: Array<LiquidityPosition>
}>
