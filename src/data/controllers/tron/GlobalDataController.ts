import { IGlobalDataController } from 'data/controllers/types/GlobalController.interface'
import { client } from 'service/client'
import {
  CurrentTrxPriceQuery,
  GlobalChartQuery,
  GlobalChartQueryVariables,
  LastBlockQuery
} from 'service/generated/tronGraphql'
import { CURRENT_TRX_PRICE, GLOBAL_CHART, LAST_BLOCK } from 'service/queries/tron/global'

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

    const formattedChart = data.whiteSwapDayDatas!.map(el => ({
      date: el!.date!,
      dailyVolumeUSD: +el!.dailyVolumeUSD!,
      totalLiquidityUSD: +el!.totalLiquidityUSD!
    }))
    return formattedChart
  }

  async getPrice() {
    const { data } = await client.query<CurrentTrxPriceQuery>({ query: CURRENT_TRX_PRICE })
    return data.trxPrice ? +data.trxPrice : 0
  }
}
