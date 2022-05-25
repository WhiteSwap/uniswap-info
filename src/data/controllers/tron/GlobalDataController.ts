import { IGlobalDataController } from 'data/controllers/types/GlobalController.interface'
import { HealthStatusMock } from '__mocks__/global'
import { client } from 'service/client'
import { CurrentTrxPriceQuery, GlobalChartQuery, GlobalChartQueryVariables } from 'service/generated/tronGraphql'
import { CURRENT_TRX_PRICE, GLOBAL_CHART } from 'service/queries/tron/global'

export default class GlobalDataController implements IGlobalDataController {
  async getHealthStatus() {
    return Promise.resolve(HealthStatusMock)
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
