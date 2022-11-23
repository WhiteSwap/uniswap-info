import { useEffect } from 'react'
import DataService from 'data/DataService'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { useActiveTokenPrice } from 'state/features/global/selectors'
import { usePairData } from 'state/features/pairs/hooks'
import { usePairs } from 'state/features/pairs/selectors'
import { useAppDispatch, useAppSelector } from 'state/hooks'

import { useAccountLiquiditySnapshots, useAccountTransactions, useTopLiquidityPositionList } from './selectors'
import {
  setLiquidityChartData,
  setPositionChartData,
  setPositionHistory,
  setPositions,
  setTopLiquidityPositions,
  setTransactions
} from './slice'

export function useUserTransactions(account: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const transactions = useAccountTransactions(account)

  useEffect(() => {
    async function fetchData(account: string) {
      const result = await DataService.transactions.getUserTransactions(account)
      dispatch(setTransactions({ account, transactions: result, networkId: activeNetwork }))
    }
    fetchData(account)
  }, [])

  return transactions
}

/**
 * Store all the snapshots of liquidity activity for this account.
 * Each snapshot is a moment when an LP position was created or updated.
 * @param {*} account
 */
export function useUserSnapshots(account: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const snapshots = useAccountLiquiditySnapshots(account)

  useEffect(() => {
    async function fetchData() {
      const result = await DataService.accounts.getUserHistory(account)
      if (result) {
        dispatch(setPositionHistory({ account, historyData: result, networkId: activeNetwork }))
      }
    }
    if (!snapshots && account) {
      fetchData()
    }
  }, [account, snapshots, activeNetwork])

  return snapshots
}

/**
 * For a given position (data about holding) and user, get the chart
 * data for the fees and liquidity over time
 * @param {*} position
 * @param {*} account
 */
export function useUserPositionChart(position: Position, account: string, timeWindow: string) {
  const dispatch = useAppDispatch()
  const pairAddress = position.pairAddress
  const activeNetwork = useActiveNetworkId()
  // get users adds and removes on this pair
  const snapshots = useUserSnapshots(account)
  const pairSnapshots =
    snapshots &&
    position &&
    snapshots.filter(currentSnapshot => {
      return currentSnapshot.pair.id === position.pairAddress
    })

  // get data needed for calculations
  const currentPairData = usePairData(pairAddress)
  const price = useActiveTokenPrice()

  // formatetd array to return for chart data
  const formattedHistory = useAppSelector(
    state => state.account[activeNetwork].byAddress?.[account]?.positionChartData?.[pairAddress]?.[timeWindow]
  )

  useEffect(() => {
    async function fetchData() {
      const fetchedData = await DataService.accounts.getPositionChart(
        account,
        currentPairData,
        timeWindow,
        pairSnapshots
      )
      dispatch(setPositionChartData({ networkId: activeNetwork, account, pairAddress, data: fetchedData }))
    }
    if (
      pairSnapshots &&
      !formattedHistory &&
      currentPairData &&
      Object.keys(currentPairData).length > 0 &&
      pairAddress &&
      price
    ) {
      fetchData()
    }
  }, [timeWindow, pairSnapshots, formattedHistory, pairAddress, currentPairData, price])

  return formattedHistory
}

/**
 * For each day starting with min(first position timestamp, beginning of time window),
 * get total liquidity supplied by user in USD. Format in array with date timestamps
 * and usd liquidity value.
 */
export function useUserLiquidityChart(account: string, timeWindow: string) {
  const dispatch = useAppDispatch()
  const history = useUserSnapshots(account)
  const activeNetwork = useActiveNetworkId()
  const liquidityChartData = useAppSelector(
    state => state.account[activeNetwork].byAddress?.[account]?.liquidityChartData?.[timeWindow]
  )

  // const [startDateTimestamp, setStartDateTimestamp] = useState<number | undefined>()
  // const activeWindow = useTimeFrame()

  // // monitor the old date fetched
  // useEffect(() => {
  //   const utcEndTime = dayjs.utc()
  //   // based on window, get starttime
  //   let utcStartTime
  //   switch (activeWindow) {
  //     case timeframeOptions.WEEK:
  //       utcStartTime = utcEndTime.subtract(1, 'week').startOf('day')
  //       break
  //     case timeframeOptions.YEAR:
  //       utcStartTime = utcEndTime.subtract(1, 'year')
  //       break
  //     default:
  //       utcStartTime = utcEndTime.subtract(1, 'year').startOf('year')
  //       break
  //   }
  //   const startTime = utcStartTime.unix() - 1
  //   if ((activeWindow && startTime < startDateTimestamp!) || !startDateTimestamp) {
  //     setStartDateTimestamp(startTime)
  //   }
  // }, [activeWindow, startDateTimestamp])

  useEffect(() => {
    async function fetchData() {
      const formattedHistory = await DataService.accounts.getUserLiquidityChart(account, timeWindow, [...history])
      dispatch(setLiquidityChartData({ data: formattedHistory, account, networkId: activeNetwork }))
    }
    if (!liquidityChartData && history && history.length > 0) {
      fetchData()
    }
  }, [history, timeWindow, liquidityChartData])

  return liquidityChartData
}

export function useUserPositions(account: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const positions = useAppSelector(state => state.account[activeNetwork].byAddress?.[account]?.positions)
  const snapshots = useUserSnapshots(account)
  const price = useActiveTokenPrice()

  useEffect(() => {
    async function fetchData(account: string) {
      const positions = await DataService.accounts.getUserPositions(account, price, snapshots)
      if (positions) {
        dispatch(setPositions({ networkId: activeNetwork, account, positions }))
      }
    }
    if (!positions && account && price && snapshots) {
      fetchData(account)
    }
  }, [account, positions, price, snapshots, activeNetwork])

  return positions
}

export function useTopLiquidityPositions() {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const topLps = useTopLiquidityPositionList()
  const allPairs = usePairs()

  useEffect(() => {
    async function fetchData() {
      const response = await DataService.accounts.getTopLps(allPairs)
      dispatch(setTopLiquidityPositions({ liquidityPositions: response, networkId: activeNetwork }))
    }

    if (allPairs && Object.keys(allPairs).length > 0) {
      fetchData()
    }
  }, [Object.keys(allPairs).length])

  return topLps
}
