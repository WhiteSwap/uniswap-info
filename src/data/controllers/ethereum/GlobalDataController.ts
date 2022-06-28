import dayjs from 'dayjs'
import { client } from 'service/client'
import { ETH_PRICE, GLOBAL_CHART, SUBGRAPH_HEALTH } from 'service/queries/ethereum/global'
import { IGlobalDataController } from 'data/controllers/types/GlobalController.interface'

async function fetchPrice(block?: number) {
  return client.query({
    query: ETH_PRICE,
    variables: {
      block: block ? { number: block } : null
    }
  })
}

export default class GlobalDataController implements IGlobalDataController {
  async getHealthStatus() {
    const status = await client.query({
      query: SUBGRAPH_HEALTH,
      context: {
        client: 'health'
      }
    })
    const syncedBlock = +status.data.indexingStatusForCurrentVersion.chains[0].latestBlock.number
    const headBlock = +status.data.indexingStatusForCurrentVersion.chains[0].chainHeadBlock.number
    return { syncedBlock, headBlock }
  }
  async getChartData(oldestDateToFetch: number): Promise<ChartDailyItem[]> {
    let data: ChartDailyItem[] = []
    const utcEndTime = dayjs.utc()
    let skip = 0
    let allFound = false

    try {
      while (!allFound) {
        const result = await client.query({
          query: GLOBAL_CHART,
          variables: {
            startTime: oldestDateToFetch,
            skip
          }
        })
        skip += 1000
        data = result.data.whiteSwapDayDatas.map((element: any) => ({
          ...element,
          totalLiquidityUSD: +element.totalLiquidityUSD,
          dailyVolumeUSD: +element.dailyVolumeUSD
        }))
        if (result.data.whiteSwapDayDatas.length < 1000) {
          allFound = true
        }
      }

      if (data) {
        const dayIndexSet = new Set()
        const dayIndexArray: any[] = []
        const oneDay = 24 * 60 * 60
        // for each day, parse the daily volume and format for chart array
        data.forEach((_dayData, index_) => {
          // add the day index to the set of days
          dayIndexSet.add((data[index_].date / oneDay).toFixed(0))
          dayIndexArray.push(data[index_])
        })

        // fill in empty days ( there will be no day datas if no trades made that day )
        let timestamp = data[0].date ? data[0].date : oldestDateToFetch
        let latestLiquidityUSD = data[0].totalLiquidityUSD
        let index = 1
        while (timestamp < utcEndTime.unix() - oneDay) {
          const nextDay = timestamp + oneDay
          const currentDayIndex = (nextDay / oneDay).toFixed(0)
          if (!dayIndexSet.has(currentDayIndex)) {
            data.push({
              date: nextDay,
              dailyVolumeUSD: 0,
              totalLiquidityUSD: latestLiquidityUSD
            })
          } else {
            latestLiquidityUSD = dayIndexArray[index].totalLiquidityUSD
            index = index + 1
          }
          timestamp = nextDay
        }
      }

      // format weekly data for weekly sized chunks
      data = data.sort((a, b) => (a.date > b.date ? 1 : -1))
    } catch (error) {
      console.log(error)
    }
    return data
  }
  async getPrice() {
    let price = 0

    try {
      const result = await fetchPrice()
      const currentPrice = +result?.data?.bundles[0]?.ethPrice
      price = currentPrice
    } catch (error) {
      console.log(error)
    }

    return price
  }
}
