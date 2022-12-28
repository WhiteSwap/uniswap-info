import dayjs from 'dayjs'
import { timeframeOptions } from 'constants/index'
import { IAccountDataController } from 'data/controllers/types/AccountController.interface'
import {
  liquiditySnapshotListMapper,
  positionFeeChartMapper,
  positionLiquidityChartMapper
} from 'data/mappers/ethereum/accountMapper'
import { client } from 'service/client'
import {
  TopLiquidityPositionQuery,
  TopLiquidityPositionVariables,
  UserLiquidityPositionSnapshotsVariables,
  UserLiquidityPositionsQuery,
  UserLiquidityPositionsVariables
} from 'service/generated/ethereumGraphql'
import {
  TOP_LPS_PER_PAIRS,
  USER_LIQUIDITY_POSITIONS,
  USER_LIQUIDITY_POSITION_SNAPSHOTS
} from 'service/queries/ethereum/accounts'
import { PAIR_DAY_DATA_BULK } from 'service/queries/ethereum/pairs'
import { AccountChartData, PositionChartData, PositionPairChartKey } from 'state/features/account/types'
import { PairDetails } from 'state/features/pairs/types'
import { getShareValueOverTime, getTimeframe, parseTokenInfo } from 'utils'
import { calculateTokenAmount } from 'utils/pair'
import { getLPReturnsOnPair, getMetricsForPositionWindow } from 'utils/returns'

type OwnershipPair = {
  lpTokenBalance: number
  timestamp: number
}

export default class AccountDataController implements IAccountDataController {
  async getPositionChart(
    _accountAddress: string,
    currentPairData: PairDetails,
    timeWindow: string,
    _key: PositionPairChartKey,
    pairSnapshots: LiquiditySnapshot[]
  ): Promise<Partial<PositionChartData>> {
    try {
      const startDateTimestamp = getTimeframe(timeWindow)
      // catch case where data not puplated yet
      if (!currentPairData.createdAtTimestamp) {
        return {}
      }
      let dayIndex: number = Math.round(startDateTimestamp / 86_400) // get unique day bucket unix
      const currentDayIndex: number = Math.round(dayjs.utc().unix() / 86_400)
      const sortedPositions = pairSnapshots.sort((a: any, b: any) => {
        return Number.parseInt(a.timestamp) > Number.parseInt(b.timestamp) ? 1 : -1
      })
      if (sortedPositions[0].timestamp > startDateTimestamp) {
        dayIndex = Math.round(sortedPositions[0].timestamp / 86_400)
      }

      const dayTimestamps = []
      while (dayIndex < currentDayIndex) {
        // only account for days where this pair existed
        if (dayIndex * 86_400 >= currentPairData?.createdAtTimestamp) {
          dayTimestamps.push(dayIndex * 86_400)
        }
        dayIndex = dayIndex + 1
      }

      // FIXME: subgraph update his request limits. This query is too large for subgraph
      // Current status for most request is 413
      // Need to refactor whole realization of position chart data
      const shareValues = await getShareValueOverTime(currentPairData.id, dayTimestamps)
      const shareValuesFormatted: any = {}
      shareValues &&
        shareValues.forEach(share => {
          shareValuesFormatted[share.timestamp] = share
        })

      // set the default position and data
      let positionT0 = pairSnapshots[0]
      const formattedHistory = []
      let netFees = 0

      // keep track of up to date metrics as we parse each day
      for (const index in dayTimestamps) {
        // get the bounds on the day
        const dayTimestamp = dayTimestamps[index]
        const timestampCeiling = dayTimestamp + 86_400

        // for each change in position value that day, create a window and update
        const dailyChanges = pairSnapshots.filter((snapshot: any) => {
          return snapshot.timestamp < timestampCeiling && snapshot.timestamp > dayTimestamp
        })
        for (const positionT1 of dailyChanges) {
          const localReturns = getMetricsForPositionWindow(positionT0, positionT1)
          netFees = netFees + localReturns.fees
          positionT0 = positionT1
        }

        // now treat the end of the day as a hypothetical position
        let positionT1: LiquiditySnapshot = shareValuesFormatted[dayTimestamp + 86_400]
        if (!positionT1) {
          positionT1 = {
            timestamp: 0,
            pair: currentPairData,
            liquidityTokenBalance: positionT0.liquidityTokenBalance,
            reserveOne: currentPairData.tokenOne.reserve,
            reserveTwo: currentPairData.tokenTwo.reserve,
            reserveUSD: currentPairData.reserveUSD,
            liquidityTokenTotalSupply: currentPairData.totalSupply
          }
        }

        if (positionT1) {
          positionT1.liquidityTokenBalance = positionT0.liquidityTokenBalance
          const currentLiquidityValue =
            (positionT1.liquidityTokenBalance / positionT1.liquidityTokenTotalSupply) * positionT1.reserveUSD
          const localReturns = getMetricsForPositionWindow(positionT0, positionT1)
          const localFees = netFees + localReturns.fees

          formattedHistory.push({
            date: dayTimestamp,
            totalLiquidityUsd: currentLiquidityValue,
            fees: localFees
          })
        }
      }

      // FIXME: ETH subgraph  query returns data only for all time range. Need to split to timeWindow manually
      const weekStartTime = getTimeframe(timeframeOptions.WEEK)
      const monthStartTime = getTimeframe(timeframeOptions.MONTH)
      const yearStartTime = getTimeframe(timeframeOptions.YEAR)

      const filteredWeekChartData = formattedHistory?.filter(entry => entry.date >= weekStartTime)
      const filteredMonthChartData = formattedHistory?.filter(entry => entry.date >= monthStartTime)
      const filteredYearChartData = formattedHistory?.filter(entry => entry.date >= yearStartTime)

      // FIXME: temporarily not the best solution. Need to global refactor fetching position chart data
      // Current realization of loading position chart contains both liquidity and fee
      // Tron chain load liquidity and fee chart data in separate request
      // Need to manually split liquidity and fee chart data
      const formattedLiquidityHistory = {
        [timeframeOptions.WEEK]: positionLiquidityChartMapper(filteredWeekChartData),
        [timeframeOptions.MONTH]: positionLiquidityChartMapper(filteredMonthChartData),
        [timeframeOptions.YEAR]: positionLiquidityChartMapper(filteredYearChartData)
      }
      const formattedFeeHistory = {
        [timeframeOptions.WEEK]: positionFeeChartMapper(filteredWeekChartData),
        [timeframeOptions.MONTH]: positionFeeChartMapper(filteredMonthChartData),
        [timeframeOptions.YEAR]: positionFeeChartMapper(filteredYearChartData)
      }

      return {
        fee: formattedFeeHistory,
        liquidity: formattedLiquidityHistory
      }
    } catch {
      return {}
    }
  }
  async getUserHistory(account: string) {
    try {
      let skip = 0
      let allResults: LiquiditySnapshot[] = []
      let found = false
      while (!found) {
        const result = await client.query<any, UserLiquidityPositionSnapshotsVariables>({
          query: USER_LIQUIDITY_POSITION_SNAPSHOTS,
          variables: {
            skip: skip,
            user: account
          },
          fetchPolicy: 'no-cache'
        })
        allResults = [...allResults, ...result.data.liquidityPositionSnapshots]
        if (result.data.liquidityPositionSnapshots.length < 1000) {
          found = true
        } else {
          skip += 1000
        }
      }
      return liquiditySnapshotListMapper(allResults)
    } catch (error) {
      console.log(error)
      return []
    }
  }
  async getUserLiquidityChart(_account: string, _timeWindow: string, history: LiquiditySnapshot[]) {
    const startDateTimestamp = getTimeframe(timeframeOptions.YEAR)
    let dayIndex = Math.floor(startDateTimestamp / 86_400) // get unique day bucket unix
    const currentDayIndex = Math.floor(dayjs.utc().unix() / 86_400)

    // sort snapshots in order
    const sortedPositions = history.sort((a, b) => {
      return a.timestamp > b.timestamp ? 1 : -1
    })
    // if UI start time is > first position time - bump start index to this time
    if (sortedPositions[0].timestamp > currentDayIndex) {
      dayIndex = Math.floor(sortedPositions[0].timestamp / 86_400)
    }

    const dayTimestamps = []
    // get date timestamps for all days in view
    while (dayIndex < currentDayIndex) {
      dayTimestamps.push(dayIndex * 86_400)
      dayIndex = dayIndex + 1
    }

    const pairIds = history.map(position => position.pair.id)

    // get all day datas where date is in this list, and pair is in pair list
    const {
      data: { pairDayDatas }
    } = await client.query<any>({
      query: PAIR_DAY_DATA_BULK,
      variables: {
        pairs: pairIds,
        startTimestamp: startDateTimestamp
      }
    })

    const formattedHistory: AccountChartData[] = []

    // map of current pair => ownership %
    const ownershipPerPair: Record<string, OwnershipPair> = {}
    for (const index in dayTimestamps) {
      const dayTimestamp = dayTimestamps[index]
      const timestampCeiling = dayTimestamp + 86_400

      // cycle through relevant positions and update ownership for any that we need to
      const relevantPositions = history.filter(snapshot => {
        return snapshot.timestamp < timestampCeiling && snapshot.timestamp > dayTimestamp
      })

      for (const index in relevantPositions) {
        const position = relevantPositions[index]
        // case where pair not added yet
        if (!ownershipPerPair[position.pair.id]) {
          ownershipPerPair[position.pair.id] = {
            lpTokenBalance: position.liquidityTokenBalance,
            timestamp: position.timestamp
          }
        }
        // case where more recent timestamp is found for pair
        if (ownershipPerPair[position.pair.id] && ownershipPerPair[position.pair.id].timestamp < position.timestamp) {
          ownershipPerPair[position.pair.id] = {
            lpTokenBalance: position.liquidityTokenBalance,
            timestamp: position.timestamp
          }
        }
      }

      // FIXME: temporary types doesnt exist
      const relavantDayDatas = Object.keys(ownershipPerPair).reduce<any[]>((accumulator, current) => {
        // find last day data after timestamp update
        const dayDatasForThisPair = pairDayDatas.filter((dayData: any) => {
          return dayData.pairAddress === current
        })
        if (dayDatasForThisPair.length > 0) {
          // find the most recent reference to pair liquidity data
          let mostRecent = dayDatasForThisPair[0]
          for (const dayData of dayDatasForThisPair) {
            if (dayData.date < dayTimestamp && dayData.date > mostRecent.date) {
              mostRecent = dayData
            }
          }
          accumulator.push(mostRecent)
        }
        return accumulator
      }, [])

      // now cycle through pair day datas, for each one find usd value = ownership[address] * reserveUSD
      const dailyUSD = relavantDayDatas.reduce((totalUSD, dayData) => {
        return (totalUSD =
          totalUSD +
          (ownershipPerPair[dayData.pairAddress]
            ? (ownershipPerPair[dayData.pairAddress].lpTokenBalance / Number.parseFloat(dayData.totalSupply)) *
              Number.parseFloat(dayData.reserveUSD)
            : 0))
      }, 0)

      formattedHistory.push({
        date: dayTimestamp,
        value: dailyUSD
      })
    }

    // FIXME: ETH subgraph pairDataBulk query returns data only for all time range. Need to split to timeWindow manually
    const weekStartTime = getTimeframe(timeframeOptions.WEEK)
    const monthStartTime = getTimeframe(timeframeOptions.MONTH)
    const yearStartTime = getTimeframe(timeframeOptions.YEAR)

    const filteredWeekChartData = formattedHistory?.filter(entry => entry.date >= weekStartTime)
    const filteredMonthChartData = formattedHistory?.filter(entry => entry.date >= monthStartTime)
    const filteredYearChartData = formattedHistory?.filter(entry => entry.date >= yearStartTime)
    return {
      [timeframeOptions.WEEK]: filteredWeekChartData,
      [timeframeOptions.MONTH]: filteredMonthChartData,
      [timeframeOptions.YEAR]: filteredYearChartData
    }
  }
  async getUserPositions(account: string, price: number, snapshots: LiquiditySnapshot[]) {
    try {
      const result = await client.query<UserLiquidityPositionsQuery, UserLiquidityPositionsVariables>({
        query: USER_LIQUIDITY_POSITIONS,
        variables: {
          user: account
        },
        fetchPolicy: 'no-cache'
      })

      if (result?.data?.liquidityPositions) {
        const formattedPositions: Position[] = result?.data?.liquidityPositions.map<Position>(positionData => {
          const { pair, liquidityTokenBalance } = positionData
          const { token0, token1, id, totalSupply, reserveUSD, reserve0, reserve1 } = pair
          const earningFeeTotalUsd = getLPReturnsOnPair(pair, price, snapshots)
          const totalUsd = calculateTokenAmount(liquidityTokenBalance, totalSupply, reserveUSD)
          const tokenOneAmount = calculateTokenAmount(liquidityTokenBalance, totalSupply, reserve0)
          const tokenTwoAmount = calculateTokenAmount(liquidityTokenBalance, totalSupply, reserve1)
          const tokenFeeUsd = earningFeeTotalUsd / 2
          const tokenOneFee = tokenFeeUsd / (+token0.derivedETH * price)
          const tokenTwoFee = tokenFeeUsd / (+token1.derivedETH * price)

          return {
            pairAddress: id,
            totalUsd,
            earningFeeTotalUsd,
            tokenOne: {
              id: token0.id,
              symbol: parseTokenInfo('symbol', token0.id, token0.symbol),
              amount: tokenOneAmount,
              fee: tokenOneFee
            },
            tokenTwo: {
              id: token1.id,
              symbol: parseTokenInfo('symbol', token1.id, token1.symbol),
              amount: tokenTwoAmount,
              fee: tokenTwoFee
            }
          }
        })
        return formattedPositions
      }
    } catch (error) {
      console.log(error)
    }
    return []
  }
  async getTopLps(allPairs: Record<string, Pair>) {
    // get top 20 by reserves
    const topPairs = Object.keys(allPairs)
      ?.sort((a, b) => (allPairs[a].totalLiquidityUSD > allPairs[b].totalLiquidityUSD ? -1 : 1))
      ?.slice(0, 99)
      .map(pair => pair)

    const topLpLists = await Promise.all(
      topPairs.map(async pair => {
        const { data: results } = await client.query<TopLiquidityPositionQuery, TopLiquidityPositionVariables>({
          query: TOP_LPS_PER_PAIRS,
          variables: {
            pair
          }
        })
        if (results) {
          return results.liquidityPositions
        }
        return []
      })
    )

    // get the top lps from the results formatted
    const topLps: LiquidityPosition[] = []
    topLpLists
      .filter(index => !!index) // check for ones not fetched correctly
      .forEach(list => {
        return list.map(entry => {
          const pairData = allPairs[entry.pair.id]
          const amount =
            (Number.parseFloat(entry.liquidityTokenBalance) / pairData.totalSupply) * pairData.totalLiquidityUSD

          return topLps.push({
            amount,
            account: entry.user?.id,
            pair: {
              id: pairData.id,
              tokenOne: {
                id: pairData.tokenOne.id,
                symbol: pairData.tokenOne.symbol
              },
              tokenTwo: {
                id: pairData.tokenTwo.id,
                symbol: pairData.tokenTwo.symbol
              }
            }
          })
        })
      })

    const sorted = [...topLps].sort((a, b) => (a.amount > b.amount ? -1 : 1))
    return sorted.splice(0, 100)
  }
}
