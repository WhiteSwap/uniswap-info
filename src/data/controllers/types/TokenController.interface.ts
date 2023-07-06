export interface ITokenDataController {
  getTopTokens(): Promise<Token[]>
  getTokenData(address: string): Promise<Token | undefined>
  getTokenPairs(tokenAddress: string): Promise<string[] | null | undefined>
  getIntervalTokenData(tokenAddress: string, startTime: number, interval: number): Promise<TimeWindowItem[]>
  getTokenChartData(tokenAddress: string, timeWindow: string): Promise<Record<string, TokenDayData[]>>
  // searchToken(value: string, id: string): Promise<any>
}
