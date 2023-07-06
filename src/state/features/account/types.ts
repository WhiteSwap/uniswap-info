export enum PositionChartView {
  fee = 'fee',
  liquidity = 'liquidity'
}

export type AccountChartData = {
  date: number
  value: number
}

export type PositionChartData = Record<PositionChartView, Record<string, AccountChartData[]>>

export interface Account {
  positions: Position[]
  transactions: Transactions
  liquiditySnapshots: LiquiditySnapshot[]
  pairReturns: Record<string, PositionChartData>
}

export type AccountStatistics = {
  topLiquidityPositions?: Array<LiquidityPosition>
  byAddress: Record<string, Account>
}

export type AccountState = Record<SupportedNetwork, AccountStatistics>

export type UpdateTransactionsPayload = ParametersWithNetwork<{
  account: string
  transactions: Transactions
}>

export type UpdatePositionsPayload = ParametersWithNetwork<{
  account: string
  positions: Position[]
}>

export type UpdatePositionHistoryPayload = ParametersWithNetwork<{
  account: string
  historyData: LiquiditySnapshot[]
}>

export type UpdatePairReturnsPayload = ParametersWithNetwork<{
  account: string
  pairAddress: string
  data: Partial<PositionChartData>
}>

export type UpdateTopLiquidityPositionsPayload = ParametersWithNetwork<{
  liquidityPositions: Array<LiquidityPosition>
}>
