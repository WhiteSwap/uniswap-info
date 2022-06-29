import { HourlyRateDataMock, PairChartDataMock } from '__mocks__/pairs'
import { IPairDataController } from 'data/controllers/types/PairController.interface'
import { pairListMapper, pairMapper } from 'data/mappers/tron/pairMappers'
import { client } from 'service/client'
import { PairListQuery, PairQuery, PairQueryVariables } from 'service/generated/tronGraphql'
import { PAIR_SEARCH } from 'service/queries/ethereum/pairs'
import { PAIR, PAIR_LIST } from 'service/queries/tron/pairs'
import { PairDayData } from 'state/features/pairs/types'

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPairChartData(_pairAddress: string): Promise<PairDayData[]> {
    return PairChartDataMock
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getHourlyRateData(_pairAddress: string, _startTime: number, _latestBlock: number) {
    return HourlyRateDataMock
  }
}
