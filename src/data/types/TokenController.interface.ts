import { MappedToken, MappedTokenDayData } from 'data/mappers/tokenMappers.types'

export interface ITokenDataController {
  getTopTokens(price: number, priceOld: number): Promise<MappedToken[]>
  getTokenData(address: string, price: number, priceOld: number): Promise<MappedToken | undefined>
  getTokenPairs(tokenAddress: string): Promise<string[]>
  getIntervalTokenData(
    tokenAddress: string,
    startTime: number,
    interval: number,
    latestBlock: number
  ): Promise<TimeWindowItem[]>
  getTokenChartData(tokenAddress: string): Promise<MappedTokenDayData[]>
  searchToken(value: string, id: string): Promise<any>
}
