import dayjs from 'dayjs'
import { timeframeOptions } from 'constants/index'
import { EthereumPair } from 'data/controllers/types/ethTypes'
import { IPairDataController } from 'data/controllers/types/PairController.interface'
import { pairChartMapper, pairListMapper, pairMapper } from 'data/mappers/ethereum/pairMappers'
import { client } from 'service/client'
import { PairChartQuery } from 'service/generated/ethereumGraphql'
import {
  HOURLY_PAIR_RATES,
  PAIRS_BULK,
  PAIRS_CURRENT,
  PAIRS_HISTORICAL_BULK,
  PAIR_CHART,
  PAIR_DATA,
  PAIR_SEARCH
} from 'service/queries/ethereum/pairs'
import {
  getTimestampsForChanges,
  getBlocksFromTimestamps,
  get2DayPercentChange,
  getPercentChange,
  splitQuery,
  parseTokenInfo,
  getTimeframe
} from 'utils'
import { getPairName } from 'utils/pair'

async function fetchPairData(pairAddress: string, block?: number) {
  return client.query({
    query: PAIR_DATA,
    variables: {
      pairAddress,
      block: block ? { number: block } : null
    }
  })
}

async function fetchHistoricalPairData(pairList: string[], price: number) {
  const [t1, t2, tWeek] = getTimestampsForChanges()
  const [{ number: b1 }, { number: b2 }, { number: bWeek }] = await getBlocksFromTimestamps([t1, t2, tWeek])

  const current = await client.query({
    query: PAIRS_BULK,
    variables: {
      allPairs: pairList
    }
  })

  const [oneDayResult, twoDayResult, oneWeekResult] = await Promise.all(
    [b1, b2, bWeek].map(async block =>
      client.query({
        query: PAIRS_HISTORICAL_BULK,
        variables: {
          pairs: pairList,
          block: block ? { number: block } : null
        }
      })
    )
  )

  const oneDayData = oneDayResult?.data?.pairs.reduce((object: any, current: { id: string }) => {
    return { ...object, [current.id]: current }
  }, {})

  const twoDayData = twoDayResult?.data?.pairs.reduce((object: any, current: { id: string }) => {
    return { ...object, [current.id]: current }
  }, {})

  const oneWeekData = oneWeekResult?.data?.pairs.reduce((object: any, current: { id: string }) => {
    return { ...object, [current.id]: current }
  }, {})

  const pairData: EthereumPair[] = await Promise.all(
    current &&
      current.data.pairs.map(async (pair: { id: string }) => {
        let oneDayHistory = oneDayData?.[pair.id]
        if (!oneDayHistory) {
          const newData = await fetchPairData(pair.id, b1)
          oneDayHistory = newData.data.pairs[0]
        }
        let twoDayHistory = twoDayData?.[pair.id]
        if (!twoDayHistory) {
          const newData = await fetchPairData(pair.id, b2)
          twoDayHistory = newData.data.pairs[0]
        }
        let oneWeekHistory = oneWeekData?.[pair.id]
        if (!oneWeekHistory) {
          const newData = await fetchPairData(pair.id, bWeek)
          oneWeekHistory = newData.data.pairs[0]
        }
        return parseData(pair, oneDayHistory, twoDayHistory, oneWeekHistory, price, b1)
      })
  )
  return pairData
}

function parseData(data: any, oneDayData: any, twoDayData: any, oneWeekData: any, price: number, oneDayBlock: number) {
  // get volume changes
  const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
    data?.volumeUSD,
    oneDayData?.volumeUSD || 0,
    twoDayData?.volumeUSD || 0
  )
  const [oneDayVolumeUntracked, volumeChangeUntracked] = get2DayPercentChange(
    data?.untrackedVolumeUSD,
    oneDayData?.untrackedVolumeUSD ? Number.parseFloat(oneDayData?.untrackedVolumeUSD) : 0,
    twoDayData?.untrackedVolumeUSD || 0
  )
  const oneWeekVolumeUSD = Number.parseFloat(oneWeekData ? data?.volumeUSD - oneWeekData?.volumeUSD : data.volumeUSD)
  const parsedData = { ...data }
  // set volume properties
  parsedData.oneDayVolumeUSD = oneDayVolumeUSD
  parsedData.oneWeekVolumeUSD = oneWeekVolumeUSD
  parsedData.volumeChangeUSD = volumeChangeUSD
  parsedData.oneDayVolumeUntracked = oneDayVolumeUntracked
  parsedData.volumeChangeUntracked = volumeChangeUntracked
  parsedData.token0 = {
    ...parsedData.token0,
    name: parseTokenInfo('name', data.token0.id, parsedData.token0.name),
    symbol: parseTokenInfo('symbol', data.token0.id, parsedData.token0.symbol)
  }
  parsedData.token1 = {
    ...parsedData.token1,
    name: parseTokenInfo('name', data.token1.id, parsedData.token1.name),
    symbol: parseTokenInfo('symbol', data.token1.id, parsedData.token1.symbol)
  }
  // set liquidity properties
  // TODO: trackedReserveETH
  parsedData.trackedReserveUSD = data.trackedReserveETH * price
  parsedData.liquidityChangeUSD = getPercentChange(data.reserveUSD, oneDayData?.reserveUSD)

  // format if pair hasnt existed for a day or a week
  if (!oneDayData && data && data.createdAtBlockNumber > oneDayBlock) {
    parsedData.oneDayVolumeUSD = Number.parseFloat(data.volumeUSD)
  }
  if (!oneDayData && data) {
    parsedData.oneDayVolumeUSD = Number.parseFloat(data.volumeUSD)
  }
  if (!oneWeekData && data) {
    parsedData.oneWeekVolumeUSD = Number.parseFloat(data.volumeUSD)
  }

  return parsedData
}

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

  async getPairList(price: number) {
    const {
      data: { pairs }
    } = await client.query<{ pairs: Array<{ id: string }> }>({
      query: PAIRS_CURRENT
    })

    // format as array of addresses
    const formattedPairs = pairs.map(pair => pair.id)

    // get data for every pair in list
    const pairsData = await fetchHistoricalPairData(formattedPairs, price)
    return pairListMapper(pairsData, price)
  }

  async getPairData(pairAddress: string, price: number) {
    const pairData = await fetchHistoricalPairData([pairAddress], price)
    return pairMapper(pairData[0], price)
  }

  async getPairChartData(pairAddress: string) {
    let data: any = []
    const utcEndTime = dayjs.utc()
    const utcStartTime = utcEndTime.subtract(1, 'year').startOf('minute')
    const startTime = utcStartTime.unix() - 1

    try {
      let allFound = false
      let skip = 0
      while (!allFound) {
        const result = await client.query<PairChartQuery>({
          query: PAIR_CHART,
          variables: {
            pairAddress,
            skip
          }
        })
        skip += 1000
        data = [...data, ...result.data.pairDayDatas]
        if (result.data.pairDayDatas.length < 1000) {
          allFound = true
        }
      }

      const dayIndexSet = new Set()
      const dayIndexArray: any = []
      const oneDay = 24 * 60 * 60
      data.forEach((_: any, index: number) => {
        // add the day index to the set of days
        dayIndexSet.add((data[index].date / oneDay).toFixed(0))
        dayIndexArray.push(data[index])
      })

      if (data[0]) {
        // fill in empty days
        let timestamp = data[0].date || startTime
        let latestLiquidityUSD = data[0].reserveUSD
        let index = 1
        while (timestamp < utcEndTime.unix() - oneDay) {
          const nextDay = timestamp + oneDay
          const currentDayIndex = (nextDay / oneDay).toFixed(0)
          if (dayIndexSet.has(currentDayIndex)) {
            latestLiquidityUSD = dayIndexArray[index].reserveUSD
            index = index + 1
          } else {
            data.push({
              date: nextDay,
              dailyVolumeUSD: 0,
              reserveUSD: +latestLiquidityUSD
            })
          }
          timestamp = nextDay
        }
      }

      data = data.sort((a: any, b: any) => (Number.parseInt(a.date) > Number.parseInt(b.date) ? 1 : -1))
    } catch (error) {
      console.log(error)
    }
    const chartData = pairChartMapper(data)
    // FIXME: ETH subgraph pairData query returns data only for all time range. Need to split to timeWindow manually
    const weekStartTime = getTimeframe(timeframeOptions.WEEK)
    const monthStartTime = getTimeframe(timeframeOptions.MONTH)
    const yearStartTime = getTimeframe(timeframeOptions.YEAR)

    const filteredWeekChartData = chartData?.filter(entry => entry.date >= weekStartTime)
    const filteredMonthChartData = chartData?.filter(entry => entry.date >= monthStartTime)
    const filteredYearChartData = chartData?.filter(entry => entry.date >= yearStartTime)

    return {
      [timeframeOptions.WEEK]: filteredWeekChartData,
      [timeframeOptions.MONTH]: filteredMonthChartData,
      [timeframeOptions.YEAR]: filteredYearChartData
    }
  }

  async getHourlyRateData(
    pairAddress: string,
    startTime: number,
    latestBlock: number,
    tokenOne: PairToken,
    tokenTwo: PairToken
  ): Promise<Record<string, TimeWindowItem[]>> {
    try {
      const utcEndTime = dayjs.utc()
      let time = startTime

      // create an array of hour start times until we reach current hour
      const timestamps = []
      while (time <= utcEndTime.unix() - 3600) {
        timestamps.push(time)
        time += 3600
      }

      // backout if invalid timestamp format
      if (timestamps.length === 0) {
        return {}
      }

      // once you have all the timestamps, get the blocks for each timestamp in a bulk query
      let blocks

      blocks = await getBlocksFromTimestamps(timestamps, 100)

      // catch failing case
      if (!blocks || blocks?.length === 0) {
        return {}
      }

      if (latestBlock) {
        blocks = blocks.filter(b => {
          return b.number <= latestBlock
        })
      }

      // TODO: refactor
      const result: any = await splitQuery(
        (parameters: BlockHeight[]) =>
          client.query({
            query: HOURLY_PAIR_RATES(pairAddress, parameters)
          }),
        blocks
      )

      // format token ETH price results
      const values = []
      for (const row in result) {
        const timestamp = row.split('t')[1]
        if (timestamp) {
          values.push({
            timestamp,
            rate0: Number.parseFloat(result[row]?.token0Price),
            rate1: Number.parseFloat(result[row]?.token1Price)
          })
        }
      }

      const formattedHistoryRate0 = []
      const formattedHistoryRate1 = []

      // for each hour, construct the open and close price
      for (let index = 0; index < values.length - 1; index++) {
        formattedHistoryRate0.push({
          timestamp: values[index].timestamp,
          open: values[index].rate0,
          close: values[index + 1].rate0
        })
        formattedHistoryRate1.push({
          timestamp: values[index].timestamp,
          open: values[index].rate1,
          close: values[index + 1].rate1
        })
      }
      // FIXME: ETH subgraph load pair data for token0/token1 & token1/token0. Need to split data manually
      const rateOne = getPairName(tokenOne.symbol, tokenTwo.symbol)
      const rateTwo = getPairName(tokenOne.symbol, tokenTwo.symbol, true)
      return {
        [rateOne]: formattedHistoryRate1,
        [rateTwo]: formattedHistoryRate0
      }
    } catch (error) {
      console.log(error)
      return {}
    }
  }
}
