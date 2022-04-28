import { FACTORY_ADDRESS } from '../../constants'
import dayjs from 'dayjs'
import { client } from 'service/client'
import { ETH_PRICE, GLOBAL_CHART, GLOBAL_DATA } from 'service/queries/global'
import { getBlocksFromTimestamps, get2DayPercentChange, getPercentChange, getBlockFromTimestamp } from 'utils'

async function fetchGlobalData(block?: number) {
  return client.query({
    query: GLOBAL_DATA,
    variables: {
      block: block ? { number: block } : null,
      factoryAddress: FACTORY_ADDRESS
    },
    fetchPolicy: 'cache-first'
  })
}

async function fetchPrice(block?: number) {
  return client.query({
    query: ETH_PRICE,
    variables: {
      block: block ? { number: block } : null
    },
    fetchPolicy: 'cache-first'
  })
}
/**
 * Gets all the global data for the overview page.
 * Needs current eth price and the old eth price to get
 * 24 hour USD changes.
 * @param {*} price
 * @param {*} oldPrice
 */
export async function getGlobalData(price: number, oldPrice: number) {
  // data for each day , historic data used for % changes
  let data: any = {}
  let oneDayData: any = {}
  let twoDayData: any = {}

  try {
    // get timestamps for the days
    const utcCurrentTime = dayjs()
    const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()
    const utcTwoDaysBack = utcCurrentTime.subtract(2, 'day').unix()
    const utcOneWeekBack = utcCurrentTime.subtract(1, 'week').unix()
    const utcTwoWeeksBack = utcCurrentTime.subtract(2, 'week').unix()

    // get the blocks needed for time travel queries
    const [oneDayBlock, twoDayBlock, oneWeekBlock, twoWeekBlock] = await getBlocksFromTimestamps([
      utcOneDayBack,
      utcTwoDaysBack,
      utcOneWeekBack,
      utcTwoWeeksBack
    ])

    // fetch the global data
    const result = await fetchGlobalData()
    data = result.data.whiteSwapFactories[0]

    // fetch the historical data
    const oneDayResult = await fetchGlobalData(oneDayBlock?.number)
    oneDayData = oneDayResult.data.whiteSwapFactories[0]

    const twoDayResult = await fetchGlobalData(twoDayBlock?.number)
    twoDayData = twoDayResult.data.whiteSwapFactories[0]

    const oneWeekResult = await fetchGlobalData(oneWeekBlock?.number)
    const oneWeekData = oneWeekResult.data.whiteSwapFactories[0]

    const twoWeekResult = await fetchGlobalData(twoWeekBlock?.number)
    const twoWeekData = twoWeekResult.data.whiteSwapFactories[0]

    if (data && oneDayData && twoDayData) {
      const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
        data.totalVolumeUSD,
        oneDayData.totalVolumeUSD ? oneDayData.totalVolumeUSD : 0,
        twoDayData.totalVolumeUSD ? twoDayData.totalVolumeUSD : 0
      )

      const [oneDayTxns, txnChange] = get2DayPercentChange(
        data.txCount,
        oneDayData.txCount ? oneDayData.txCount : 0,
        twoDayData.txCount ? twoDayData.txCount : 0
      )

      // format the total liquidity in USD
      data.totalLiquidityUSD = data.totalLiquidityETH * price
      const liquidityChangeUSD = getPercentChange(
        data.totalLiquidityETH * price,
        oneDayData.totalLiquidityETH * oldPrice
      )

      // add relevant fields with the calculated amounts
      data.oneDayVolumeUSD = oneDayVolumeUSD

      data.volumeChangeUSD = volumeChangeUSD
      data.liquidityChangeUSD = liquidityChangeUSD
      data.oneDayTxns = oneDayTxns
      data.txnChange = txnChange
    }

    if (data && oneDayData && twoDayData && twoWeekData) {
      const [oneWeekVolume, weeklyVolumeChange] = get2DayPercentChange(
        data.totalVolumeUSD,
        oneWeekData.totalVolumeUSD,
        twoWeekData.totalVolumeUSD
      )
      data.oneWeekVolume = oneWeekVolume
      data.weeklyVolumeChange = weeklyVolumeChange
    }
  } catch (e) {
    console.log(e)
  }

  return data
}

/**
 * Get historical data for volume and liquidity used in global charts
 * on main page
 * @param {*} oldestDateToFetch // start of window to fetch from
 */
export async function getChartData(oldestDateToFetch: number) {
  let data: any[] = []
  const weeklyData: any[] = []
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
        },
        fetchPolicy: 'cache-first'
      })
      skip += 1000
      data = result.data.whiteSwapDayDatas.map((el: any) => ({ ...el, dailyVolumeUSD: parseFloat(el.dailyVolumeUSD) }))
      if (result.data.whiteSwapDayDatas.length < 1000) {
        allFound = true
      }
    }

    if (data) {
      const dayIndexSet = new Set()
      const dayIndexArray: any[] = []
      const oneDay = 24 * 60 * 60
      // for each day, parse the daily volume and format for chart array
      data.forEach((_dayData, i) => {
        // add the day index to the set of days
        dayIndexSet.add((data[i].date / oneDay).toFixed(0))
        dayIndexArray.push(data[i])
      })

      // fill in empty days ( there will be no day datas if no trades made that day )
      let timestamp = data[0].date ? data[0].date : oldestDateToFetch
      let latestLiquidityUSD = data[0].totalLiquidityUSD
      let latestDayDats = data[0].mostLiquidTokens
      let index = 1
      while (timestamp < utcEndTime.unix() - oneDay) {
        const nextDay = timestamp + oneDay
        const currentDayIndex = (nextDay / oneDay).toFixed(0)
        if (!dayIndexSet.has(currentDayIndex)) {
          data.push({
            date: nextDay,
            dailyVolumeUSD: 0,
            totalLiquidityUSD: latestLiquidityUSD,
            mostLiquidTokens: latestDayDats
          })
        } else {
          latestLiquidityUSD = dayIndexArray[index].totalLiquidityUSD
          latestDayDats = dayIndexArray[index].mostLiquidTokens
          index = index + 1
        }
        timestamp = nextDay
      }
    }

    // format weekly data for weekly sized chunks
    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
    let startIndexWeekly = -1
    let currentWeek = -1
    data.forEach((_entry, i) => {
      const week = dayjs.utc(dayjs.unix(data[i].date)).week()
      if (week !== currentWeek) {
        currentWeek = week
        startIndexWeekly++
      }
      weeklyData[startIndexWeekly] = weeklyData[startIndexWeekly] || {}
      weeklyData[startIndexWeekly].date = data[i].date
      weeklyData[startIndexWeekly].weeklyVolumeUSD =
        (weeklyData[startIndexWeekly].weeklyVolumeUSD ?? 0) + data[i].dailyVolumeUSD
    })
  } catch (e) {
    console.log(e)
  }
  return [data, weeklyData]
}

/**
 * Gets the current price  of ETH, 24 hour price, and % change between them
 */
export async function getPrice() {
  const utcCurrentTime = dayjs()
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').startOf('minute').unix()

  let price = 0
  let priceOneDay = 0
  let priceChange = 0

  try {
    const oneDayBlock = await getBlockFromTimestamp(utcOneDayBack)
    const result = await fetchPrice()
    const resultOneDay = await fetchPrice(oneDayBlock)
    const currentPrice = result?.data?.bundles[0]?.ethPrice
    const oneDayBackPrice = resultOneDay?.data?.bundles[0]?.ethPrice
    priceChange = getPercentChange(currentPrice, oneDayBackPrice)
    price = currentPrice
    priceOneDay = oneDayBackPrice
  } catch (e) {
    console.log(e)
  }

  return [price, priceOneDay, priceChange]
}
