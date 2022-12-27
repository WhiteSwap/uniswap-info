import dayjs from 'dayjs'
import { IAccountDataController } from 'data/controllers/types/AccountController.interface'
import { liquiditySnapshotListMapper, userPositionListMapper } from 'data/mappers/ethereum/accountMapper'
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
import { LiquidityChart } from 'state/features/account/types'
import { getLPReturnsOnPair } from 'utils/returns'

type OwnershipPair = {
  lpTokenBalance: number
  timestamp: number
}

export default class AccountDataController implements IAccountDataController {
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
  async getUserLiquidityChart(startDateTimestamp: number, history: LiquiditySnapshot[]) {
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

    const formattedHistory: LiquidityChart[] = []

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
        valueUSD: dailyUSD
      })
    }

    return formattedHistory
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
        const formattedPositions = await Promise.all(
          result?.data?.liquidityPositions.map(async (positionData: any) => {
            const feeEarned = await getLPReturnsOnPair(positionData.pair, price, snapshots)
            return {
              ...positionData,
              feeEarned: feeEarned ?? 0
            }
          })
        )
        return userPositionListMapper(price, formattedPositions)
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
