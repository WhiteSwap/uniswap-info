import dayjs from 'dayjs'
import { timestampUnitType } from 'constants/index'
import { IPairDataController } from 'data/controllers/types/PairController.interface'
import { pairChartDataMapper, pairListMapper, pairMapper, pairPriceDataMapper } from 'data/mappers/tron/pairMappers'
import { client } from 'service/client'
import {
  PairDailyDataQuery,
  PairDailyDataQueryVariables,
  PairHourlyPriceQuery,
  PairHourlyPriceQueryVariables,
  PairListQuery,
  PairQuery,
  PairQueryVariables
} from 'service/generated/tronGraphql'
import { PAIR_SEARCH } from 'service/queries/ethereum/pairs'
import { PAIR, PAIR_DAILY_DATA, PAIR_HOURLY_PRICE, PAIR_LIST } from 'service/queries/tron/pairs'
import { PairDayData } from 'state/features/pairs/types'
import { getPairName } from 'utils/pair'

export default class PairDataController implements IPairDataController {
  async searchPair(tokens: string[], id: string) {
    return client.query({
      query: PAIR_SEARCH,
      variables: {
        tokens,
        id
      }
    })
  }

  async getPairList() {
    // TODO: change token id to token address. temporary set no-cache fetch-policy because apollo cache crashes with multiple id's
    const response = await client.query<PairListQuery>({ query: PAIR_LIST, fetchPolicy: 'no-cache' })
    return pairListMapper(response.data)
  }

  async getPairData(pairAddress: string) {
    const { data } = await client.query<PairQuery, PairQueryVariables>({
      query: PAIR,
      variables: { address: pairAddress }
    })
    return pairMapper(data.pair)
  }

  async getPairChartData(pairAddress: string, timeWindow: string): Promise<Record<string, PairDayData[]>> {
    const currentTime = dayjs.utc()
    const startTime = currentTime.subtract(1, timestampUnitType[timeWindow]).startOf('day').unix()

    const { data } = await client.query<PairDailyDataQuery, PairDailyDataQueryVariables>({
      query: PAIR_DAILY_DATA,
      variables: { id: pairAddress, startTime }
    })

    return { [timeWindow]: pairChartDataMapper(data) }
  }

  async getHourlyRateData(
    pairAddress: string,
    startTime: number,
    _latestBlock: number,
    tokenOneSymbol: string,
    tokenTwoSymbol: string,
    isReversedPair: boolean
  ) {
    const name = getPairName(tokenOneSymbol, tokenTwoSymbol, isReversedPair)
    const { data } = await client.query<PairHourlyPriceQuery, PairHourlyPriceQueryVariables>({
      query: PAIR_HOURLY_PRICE,
      variables: { startTime, id: pairAddress, name }
    })
    const hourlyData = pairPriceDataMapper(data)
    return { [name]: hourlyData }
  }
}
