import { IGlobalDataController } from 'data/controllers/types/GlobalController.interface'
import { client } from 'service/client'
import {
  CurrentTrxPriceQuery,
  GlobalChartQuery,
  GlobalChartQueryVariables,
  LastBlockQuery
} from 'service/generated/graphql'
import { CURRENT_TRX_PRICE, GLOBAL_CHART, LAST_BLOCK } from 'service/queries/global'

export default class GlobalDataController implements IGlobalDataController {
  async getHealthStatus() {
    try {
      const { data } = await client.query<LastBlockQuery>({ query: LAST_BLOCK })
      // lastBlock === headBlock because TRONWEB cannot return headBlock
      return { syncedBlock: data.lastBlock, headBlock: data.lastBlock }
    } catch {
      // FIXME: load data from server. Temporary solution for ETH
      return { syncedBlock: 0.1, headBlock: 0.1 }
    }
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
    const { data } = await client.query<CurrentTrxPriceQuery>({ query: CURRENT_TRX_PRICE })
    return data.trxPrice ? +data.trxPrice : 0
  }
}
