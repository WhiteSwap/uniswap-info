import { pairListMapper } from 'data/mappers/tron/pairMappers'
import { IPairDataController } from 'data/controllers/types/PairController.interface'
import { client } from 'service/client'
import { PAIR_SEARCH } from 'service/queries/ethereum/pairs'
import { PairDayData } from 'state/features/pairs/types'
import { HourlyRateDataMock, PairChartDataMock, TronPairListMock } from '__mocks__/pairs'
import { PAIR_LIST } from 'service/queries/tron/pairs'
import { PairListQuery } from 'service/generated/tronGraphql'

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPairList(_price: number) {
    const response = await client.query<PairListQuery>({ query: PAIR_LIST })
    return pairListMapper(response.data)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPairData(_pairList: string, _price: number) {
    return Promise.resolve(TronPairListMock[0])
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPairChartData(_pairAddress: string): Promise<PairDayData[]> {
    return Promise.resolve(PairChartDataMock)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getHourlyRateData(_pairAddress: string, _startTime: number, _latestBlock: number) {
    return Promise.resolve(HourlyRateDataMock)
  }
}
