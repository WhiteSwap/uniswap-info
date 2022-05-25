export interface ITokenDataController {
  getTopTokens(price: number): Promise<Token[]>
  getTokenData(address: string, price: number): Promise<Token | undefined>
  getTokenPairs(tokenAddress: string): Promise<string[] | undefined>
  getIntervalTokenData(
    tokenAddress: string,
    startTime: number,
    interval: number,
    latestBlock: number
  ): Promise<TimeWindowItem[]>
  getTokenChartData(tokenAddress: string): Promise<TokenDayData[]>
  searchToken(value: string, id: string): Promise<any>
}
