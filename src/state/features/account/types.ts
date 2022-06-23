import { SupportedNetwork } from 'constants/networks'

type PairReturns = Record<string, PairReturn[]>

export interface Account {
  positions: Position[]
  transactions: Transactions
  liquiditySnapshots: LiquiditySnapshot[]
  pairReturns: PairReturns
}

export type AccountNetworkState = {
  topLiquidityPositions?: Array<LiquidityPosition>
  byAddress: Record<string, Account>
}

export type LiquidityChart = {
  date: number
  valueUSD: number
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

export type UpdatePositionHistoryPayload = ParametersWithNetwork<{
  account: string
  historyData: LiquiditySnapshot[]
}>

export type UpdatePairReturnsPayload = ParametersWithNetwork<{
  account: string
  pairAddress: string
  data: PairReturn[]
}>

export type UpdateTopLiquidityPositionsPayload = ParametersWithNetwork<{
  liquidityPositions: Array<LiquidityPosition>
}>
