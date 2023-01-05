import { useEffect, useMemo, useState } from 'react'
import DataService from 'data/DataService'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { useActiveTokenPrice } from 'state/features/global/selectors'
import { usePairData } from 'state/features/pairs/hooks'
import { usePairs } from 'state/features/pairs/selectors'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { setPairReturns, setPositionHistory, setPositions, setTopLiquidityPositions, setTransactions } from './slice'
import { AccountChartData, PositionChartView } from './types'

// FIXME: remove this file from state/features/account to separate features folder

export function useUserTransactions(account: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const transactions = useAppSelector(state => state.account[activeNetwork].byAddress?.[account]?.transactions)

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
  const snapshots = useAppSelector(state => state.account[activeNetwork].byAddress?.[account]?.liquiditySnapshots)

  useEffect(() => {
    async function fetchData() {
      const result = await DataService.accounts.getUserHistory(account)
      if (result) {
        dispatch(setPositionHistory({ account, historyData: result, networkId: activeNetwork }))
      }
    }
    fetchData()
  }, [])

  return snapshots
}

/**
 * For a given position (data about holding) and user, get the chart
 * data for the fees and liquidity over time
 * @param {*} position
 * @param {*} account
 */
export function useUserPositionChart(
  pairAddress: string,
  account: string,
  timeWindow: string,
  key: PositionChartView,
  liquiditySnapshots?: LiquiditySnapshot[]
) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const chartData = useAppSelector(
    state => state.account[activeNetwork].byAddress?.[account]?.pairReturns?.[pairAddress]?.[key]?.[timeWindow]
  )
  const pairSnapshots = useMemo(
    () => liquiditySnapshots?.filter(currentSnapshot => currentSnapshot.pair.id === pairAddress),
    [liquiditySnapshots]
  )
  const currentPairData = usePairData(pairAddress)
  const price = useActiveTokenPrice()

  useEffect(() => {
    async function fetchData() {
      const fetchedData = await DataService.accounts.getPositionChart(
        account,
        currentPairData,
        timeWindow,
        key,
        pairSnapshots!
      )
      dispatch(setPairReturns({ networkId: activeNetwork, account, pairAddress, data: fetchedData }))
    }
    if (
      pairSnapshots &&
      currentPairData &&
      Object.keys(currentPairData).length > 0 &&
      pairAddress &&
      price &&
      !chartData
    ) {
      fetchData()
    }
  }, [timeWindow, pairAddress, Boolean(pairSnapshots && currentPairData && price), key])

  return chartData
}

/**
 * For each day starting with min(first position timestamp, beginning of time window),
 * get total liquidity supplied by user in USD. Format in array with date timestamps
 * and usd liquidity value.
 */
export function useUserLiquidityChart(account: string, timeWindow: string, liquiditySnapshots?: LiquiditySnapshot[]) {
  const [data, setData] = useState<Record<string, AccountChartData[]> | undefined>(undefined)

  useEffect(() => {
    async function fetchData() {
      const formattedHistory = await DataService.accounts.getUserLiquidityChart(account, timeWindow, [
        ...liquiditySnapshots!
      ])
      setData(oldChartData => ({ ...oldChartData, ...formattedHistory }))
    }
    if (liquiditySnapshots) {
      fetchData()
    }
  }, [liquiditySnapshots, timeWindow])

  return data?.[timeWindow]
}

export function useUserPositions(account: string, liquiditySnapshots?: LiquiditySnapshot[]) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const positions = useAppSelector(state => state.account[activeNetwork].byAddress?.[account]?.positions)
  const price = useActiveTokenPrice()

  useEffect(() => {
    async function fetchData(account: string) {
      const positions = await DataService.accounts.getUserPositions(account, price, liquiditySnapshots!)
      if (positions) {
        dispatch(setPositions({ networkId: activeNetwork, account, positions }))
      }
    }
    if (price && liquiditySnapshots) {
      fetchData(account)
    }
  }, [price, Boolean(liquiditySnapshots)])

  return positions
}

export function useTopLiquidityPositions() {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const topLps = useAppSelector(state => state.account[activeNetwork].topLiquidityPositions)
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
