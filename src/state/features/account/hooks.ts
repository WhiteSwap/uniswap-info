import { useEffect, useState } from 'react'
import DataService from 'data/DataService'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { useActiveTokenPrice } from 'state/features/global/selectors'
import { usePairData } from 'state/features/pairs/hooks'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { setPairReturns, setPositions, setTopLiquidityPositions, setTransactions } from './slice'
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
  }, [account])

  return transactions
}

/**
 * For a given position (data about holding) and user, get the chart
 * data for the fees and liquidity over time
 * @param {*} position
 * @param {*} account
 */
export function useUserPositionChart(pairAddress: string, account: string, timeWindow: string, key: PositionChartView) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const chartData = useAppSelector(
    state => state.account[activeNetwork].byAddress?.[account]?.pairReturns?.[pairAddress]?.[key]?.[timeWindow]
  )

  const currentPairData = usePairData(pairAddress)
  const price = useActiveTokenPrice()

  useEffect(() => {
    async function fetchData() {
      const fetchedData = await DataService.accounts.getPositionChart(account, currentPairData, timeWindow, key)
      dispatch(setPairReturns({ networkId: activeNetwork, account, pairAddress, data: fetchedData }))
    }
    if (currentPairData && Object.keys(currentPairData).length > 0 && pairAddress && price && !chartData) {
      fetchData()
    }
  }, [timeWindow, pairAddress, Boolean(currentPairData && price), key])

  return chartData
}

/**
 * For each day starting with min(first position timestamp, beginning of time window),
 * get total liquidity supplied by user in USD. Format in array with date timestamps
 * and usd liquidity value.
 */
export function useUserLiquidityChart(account: string, timeWindow: string) {
  const [data, setData] = useState<Record<string, AccountChartData[]> | undefined>(undefined)

  useEffect(() => {
    async function fetchData() {
      const formattedHistory = await DataService.accounts.getUserLiquidityChart(account, timeWindow)
      setData(oldChartData => ({ ...oldChartData, ...formattedHistory }))
    }
    fetchData()
  }, [timeWindow])

  return data?.[timeWindow]
}

export function useUserPositions(account: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const positions = useAppSelector(state => state.account[activeNetwork].byAddress?.[account]?.positions)

  useEffect(() => {
    async function fetchData(account: string) {
      const positions = await DataService.accounts.getUserPositions(account)
      if (positions) {
        dispatch(setPositions({ networkId: activeNetwork, account, positions }))
      }
    }
    fetchData(account)
  }, [account])

  return positions
}

export function useTopLiquidityPositions() {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const topLps = useAppSelector(state => state.account[activeNetwork].topLiquidityPositions)

  useEffect(() => {
    async function fetchData() {
      const response = await DataService.accounts.getTopLps()
      dispatch(setTopLiquidityPositions({ liquidityPositions: response, networkId: activeNetwork }))
    }

    fetchData()
  }, [])

  return topLps
}
