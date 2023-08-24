import { IGlobalDataController } from 'data/controllers/types/GlobalController.interface'
import { client } from 'service/client'
import {
  GlobalChartQuery,
  GlobalChartQueryVariables,
  LastBlockQuery,
  NativeTokenPriceQuery
} from 'service/generated/graphql'
import { NATIVE_TOKEN_PRICE, GLOBAL_CHART, LAST_BLOCK } from 'service/queries/global'

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
    const { data } = await client.query<NativeTokenPriceQuery>({ query: NATIVE_TOKEN_PRICE })
    return data.nativeTokenPrice ? +data.nativeTokenPrice : 0
  }
}
