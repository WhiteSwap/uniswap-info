export interface TokenDetails extends Token {
  transactions?: Transactions
  chartData?: Record<string, TokenDayData[]>
  tokenPairs?: string[] | null
  timeWindowData?: Record<string, Record<string, TimeWindowItem[]>>
}

export type TokenState = Record<SupportedNetwork, Record<string, TokenDetails>>

export type UpdateTokenPayload = ParametersWithNetwork<{
  tokenAddress: string
  data: Token
}>

export type UpdateTopTokensPayload = ParametersWithNetwork<{
  topTokens: Token[]
}>

export type UpdateTransactionsPayload = ParametersWithNetwork<{
  address: string
  transactions: Transactions
}>

export type UpdateChartDataPayload = ParametersWithNetwork<{
  address: string
  chartData: Record<string, TokenDayData[]>
}>

export type UpdatePriceDataPayload = ParametersWithNetwork<{
  address: string
  data: TimeWindowItem[]
  timeWindow: string
  interval: number
}>

export type UpdateAllPairsPayload = ParametersWithNetwork<{
  address: string
  allPairs?: string[] | null
}>
