import { timeframeOptions } from 'constants/index'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useActiveNetworkId, useLatestBlock } from 'state/features/application/selectors'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { setChartData, setHourlyData, setPair, setPairTransactions, setTopPairs } from './slice'
import { useActiveTokenPrice } from 'state/features/global/selectors'
import DataService from 'data/DataService'
import { isValidAddress } from 'utils'

export function useHourlyRateData(pairAddress: string, timeWindow: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const latestBlock = useLatestBlock()
  const chartData = useAppSelector(state => state.pairs[activeNetwork]?.[pairAddress]?.timeWindowData?.[timeWindow])

  useEffect(() => {
    const currentTime = dayjs.utc()
    const windowSize = timeWindow === timeframeOptions.MONTH ? 'month' : 'week'
    const startTime =
      timeWindow === timeframeOptions.ALL_TIME
        ? 1_589_760_000
        : currentTime.subtract(1, windowSize).startOf('hour').unix()

    async function fetch() {
      const data = await DataService.pairs.getHourlyRateData(pairAddress, startTime, latestBlock)
      dispatch(setHourlyData({ address: pairAddress, hourlyData: data, timeWindow, networkId: activeNetwork }))
    }
    if (!chartData && latestBlock) {
      fetch()
    }
  }, [chartData, timeWindow, pairAddress, latestBlock, activeNetwork])

  return chartData
}

/**
 * Get all the current and 24hr changes for a pair
 */
export function usePairData(pairAddress: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const price = useActiveTokenPrice()
  const pairData = useAppSelector(state => state.pairs[activeNetwork]?.[pairAddress])

  useEffect(() => {
    async function fetchData() {
      const data = await DataService.pairs.getPairData(pairAddress, price)
      data && dispatch(setPair({ networkId: activeNetwork, pairAddress, data }))
    }
    if (!pairData && pairAddress && price && isValidAddress(pairAddress, activeNetwork)) {
      fetchData()
    }
  }, [pairAddress, pairData, price, activeNetwork])

  return pairData || {}
}

/**
 * Get most recent txns for a pair
 */
export function usePairTransactions(pairAddress: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const pairTxns = useAppSelector(state => state.pairs[activeNetwork]?.[pairAddress]?.txns)
  useEffect(() => {
    async function checkForTxns() {
      const transactions = await DataService.transactions.getPairTransactions(pairAddress)
      dispatch(setPairTransactions({ networkId: activeNetwork, transactions, address: pairAddress }))
    }
    checkForTxns()
  }, [pairAddress, activeNetwork])
  return pairTxns
}

export function usePairChartData(pairAddress: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const chartData = useAppSelector(state => state.pairs[activeNetwork]?.[pairAddress]?.chartData)

  useEffect(() => {
    async function checkForChartData() {
      if (!chartData) {
        const data = await DataService.pairs.getPairChartData(pairAddress)
        dispatch(setChartData({ networkId: activeNetwork, chartData: data, address: pairAddress }))
      }
    }
    checkForChartData()
  }, [chartData, pairAddress, activeNetwork])
  return chartData
}

export function useFetchPairs() {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const price = useActiveTokenPrice()

  useEffect(() => {
    async function getData() {
      const topPairs = await DataService.pairs.getPairList(price)
      topPairs && dispatch(setTopPairs({ topPairs, networkId: activeNetwork }))
    }
    price && getData()
  }, [price, activeNetwork])
}
