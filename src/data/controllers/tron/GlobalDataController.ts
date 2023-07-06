import { IGlobalDataController } from 'data/controllers/types/GlobalController.interface'
import { client } from 'service/client'
import {
  CurrentTrxPriceQuery,
  GlobalChartQuery,
  GlobalChartQueryVariables,
  LastBlockQuery
} from 'service/generated/tronGraphql'
import { NATIVE_TOKEN_PRICE, GLOBAL_CHART, LAST_BLOCK } from 'service/queries/tron/global'

export default class GlobalDataController implements IGlobalDataController {
  async getHealthStatus() {
    const { data } = await client.query<LastBlockQuery>({ query: LAST_BLOCK })
    // lastBlock === headBlock because TRONWEB cannot return headBlock
    return { syncedBlock: data.lastBlock, headBlock: data.lastBlock }
  }
  async getChartData(oldestDateToFetch: number): Promise<ChartDailyItem[]> {
    const { data } = await client.query<GlobalChartQuery, GlobalChartQueryVariables>({
      query: GLOBAL_CHART,
      variables: { startTime: oldestDateToFetch }
    })

    return data.whiteSwapDayDatas!.map(element => ({
      date: element.date,
      dailyVolumeUSD: +element.dailyVolumeUSD,
      totalLiquidityUSD: +element.totalLiquidityUSD
    }))
  }

  async getPrice() {
    const { data } = await client.query<CurrentTrxPriceQuery>({ query: NATIVE_TOKEN_PRICE })
    return data.nativeTokenPrice ? +data.nativeTokenPrice : 0
  }
}
