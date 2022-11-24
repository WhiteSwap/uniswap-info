import { useEffect, useState } from 'react'
import DataService from 'data/DataService'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { useActiveTokenPrice } from 'state/features/global/selectors'
import { usePairData } from 'state/features/pairs/hooks'
import { usePairs } from 'state/features/pairs/selectors'
import { useAppDispatch, useAppSelector } from 'state/hooks'

import { useAccountLiquiditySnapshots } from './selectors'
import { setLiquidityChartData, setPositionChartData, setPositionHistory } from './slice'

export function useUserTransactions(account: string) {
  const [data, setData] = useState<Transactions | undefined>(undefined)

  useEffect(() => {
    async function fetchData(account: string) {
      const result = await DataService.transactions.getUserTransactions(account)
      setData(result)
    }
    fetchData(account)
  }, [])

  return data
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
    state => state.account[activeNetwork][account]?.positionChartData?.[pairAddress]?.[timeWindow]
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
    state => state.account[activeNetwork][account]?.liquidityChartData?.[timeWindow]
  )

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
  const [data, setData] = useState<Position[] | undefined>()
  const snapshots = useUserSnapshots(account)
  const price = useActiveTokenPrice()

  useEffect(() => {
    async function fetchData(account: string) {
      const positions = await DataService.accounts.getUserPositions(account, price, snapshots)
      if (positions) {
        setData(positions)
      }
    }
    if (price && snapshots) {
      fetchData(account)
    }
  }, [price, snapshots])

  return data
}

export function useTopLiquidityPositions() {
  const allPairs = usePairs()
  const [data, setData] = useState<LiquidityPosition[] | undefined>(undefined)

  useEffect(() => {
    async function fetchData() {
      const response = await DataService.accounts.getTopLps(allPairs)
      setData(response)
    }

    if (allPairs && Object.keys(allPairs).length > 0) {
      fetchData()
    }
  }, [Object.keys(allPairs).length])

  return data
}
