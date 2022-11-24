import { SupportedNetwork } from 'constants/networks'

export interface Account {
  liquiditySnapshots: LiquiditySnapshot[]
  liquidityChartData: Record<string, LiquidityChart[]>
  positionChartData: Record<string, Record<string, PairReturn[]>>
}

export type LiquidityChart = {
  date: number
  value: number
}

export type AccountState = Record<SupportedNetwork, Record<string, Account>>

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
