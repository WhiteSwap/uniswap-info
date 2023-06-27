import { PairDayData } from 'state/features/pairs/types'

export interface IPairDataController {
  getPairList(): Promise<Pair[]>
  /**
   * Fetch user liquidity value by specific period of time.
   * For each day starting with min(first position timestamp, beginning of time window),
   * get total liquidity supplied by user in USD.
   * @param  {string[]} pairs - list of pair addresses which user provide liquidity
   * @param  {number} startDateTimestamp - selected period of time
   */
  getPairData(pairList: string): Promise<Pair>
  getPairChartData(pairAddress: string, timeWindow: string): Promise<Record<string, PairDayData[]>>
  getHourlyRateData(
    pairAddress: string,
    startTime: number,
    tokenOne: PairToken,
    tokenTwo: PairToken,
    isReversedPair: boolean
  ): Promise<Record<string, TimeWindowItem[]>>
  // searchPair(tokens: string[], id: string): any
}
