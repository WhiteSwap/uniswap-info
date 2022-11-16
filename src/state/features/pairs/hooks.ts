import { useEffect } from 'react'
import dayjs from 'dayjs'
import { timeframeOptions, timestampUnitType } from 'constants/index'
import DataService from 'data/DataService'
import { useActiveNetworkId, useLatestBlock } from 'state/features/application/selectors'
import { useActiveTokenPrice } from 'state/features/global/selectors'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { isValidAddress } from 'utils'
import { getPairName } from 'utils/pair'
import { setChartData, setHourlyData, setPair, setPairTransactions, setTopPairs } from './slice'

export function useHourlyRateData(pairAddress: string, timeWindow: string, enabled: boolean, isReversedPair: boolean) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const latestBlock = useLatestBlock()
  const pairData = useAppSelector(state => state.pairs[activeNetwork]?.[pairAddress])
  const chartData = useAppSelector(state => {
    if (pairData?.tokenOne && pairData?.tokenTwo) {
      const pairName = getPairName(pairData.tokenOne.symbol, pairData.tokenTwo.symbol, isReversedPair)
      return state.pairs[activeNetwork]?.[pairAddress]?.timeWindowData?.[timeWindow]?.[pairName]
    }
    return []
  })

  useEffect(() => {
    const currentTime = dayjs.utc()
    const subtractUnit = timeWindow === timeframeOptions.YEAR ? 'year' : 'hour'
    const startTime = currentTime.subtract(1, timestampUnitType[timeWindow]).startOf(subtractUnit).unix()

    async function fetch() {
      const data = await DataService.pairs.getHourlyRateData(
        pairAddress,
        startTime,
        latestBlock,
        pairData.tokenOne.symbol,
        pairData.tokenTwo.symbol,
        isReversedPair
      )
      dispatch(setHourlyData({ address: pairAddress, hourlyData: data, timeWindow, networkId: activeNetwork }))
    }
    if (!chartData && latestBlock && pairData?.tokenOne && pairData?.tokenTwo && enabled) {
      fetch()
    }
  }, [chartData, timeWindow, pairAddress, latestBlock, activeNetwork, pairData, enabled, isReversedPair])

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

export function usePairChartData(pairAddress: string, timeWindow: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const chartData = useAppSelector(state => state.pairs[activeNetwork]?.[pairAddress]?.chartData?.[timeWindow])

  useEffect(() => {
    async function checkForChartData() {
      const data = await DataService.pairs.getPairChartData(pairAddress, timeWindow)
      dispatch(setChartData({ networkId: activeNetwork, chartData: data, address: pairAddress }))
    }
    if (!chartData && pairAddress) {
      checkForChartData()
    }
  }, [chartData, pairAddress, activeNetwork, timeWindow])
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
