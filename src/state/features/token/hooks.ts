import { useEffect } from 'react'
import dayjs from 'dayjs'
import { timeframeOptions, timestampUnitType } from 'constants/index'
import DataService from 'data/DataService'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { isValidAddress } from 'utils'
import { setTokenPairs, setChartData, setPriceData, setToken, setTopTokens, setTransactions } from './slice'

export function useFetchTokens() {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()

  useEffect(() => {
    async function fetchData() {
      // get top pairs for overview list
      const topTokens = await DataService.tokens.getTopTokens()
      topTokens && dispatch(setTopTokens({ networkId: activeNetwork, topTokens }))
    }
    fetchData()
  }, [activeNetwork])
}

export function useTokenData(tokenAddress: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const tokenData = useAppSelector(state => state.token[activeNetwork]?.[tokenAddress])

  useEffect(() => {
    async function fetchData() {
      const data = await DataService.tokens.getTokenData(tokenAddress)
      data && dispatch(setToken({ tokenAddress, networkId: activeNetwork, data }))
    }
    if (!tokenData && isValidAddress(tokenAddress, activeNetwork)) {
      fetchData()
    }
  }, [tokenAddress, tokenData, activeNetwork])

  return tokenData || {}
}

export function useTokenTransactions(tokenAddress: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const tokenTransactions = useAppSelector(state => state.token[activeNetwork]?.[tokenAddress]?.transactions)

  useEffect(() => {
    async function checkForTransactions() {
      const transactions = await DataService.transactions.getTokenTransactions(tokenAddress)
      dispatch(setTransactions({ networkId: activeNetwork, transactions, address: tokenAddress }))
    }

    checkForTransactions()
  }, [])

  return tokenTransactions
}

export function useTokenPairsIds(tokenAddress: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const tokenPairs = useAppSelector(state => state.token[activeNetwork]?.[tokenAddress]?.tokenPairs)

  useEffect(() => {
    async function fetchData() {
      const allPairs = await DataService.tokens.getTokenPairs(tokenAddress)
      dispatch(setTokenPairs({ networkId: activeNetwork, allPairs, address: tokenAddress }))
    }
    if (!tokenPairs && isValidAddress(tokenAddress, activeNetwork)) {
      fetchData()
    }
  }, [tokenAddress, tokenPairs, activeNetwork])

  return tokenPairs || []
}

export function useTokenChartData(tokenAddress: string, timeWindow: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const chartData = useAppSelector(state => state.token[activeNetwork]?.[tokenAddress]?.chartData?.[timeWindow])

  useEffect(() => {
    async function fetchData() {
      const data = await DataService.tokens.getTokenChartData(tokenAddress, timeWindow)
      dispatch(setChartData({ networkId: activeNetwork, chartData: data, address: tokenAddress }))
    }
    if (!chartData && tokenAddress) {
      fetchData()
    }
  }, [chartData, tokenAddress, timeWindow])

  return chartData
}

/**
 * get candlestick data for a token - saves in context based on the window and the
 * interval size
 * @param {*} tokenAddress
 * @param {*} timeWindow // a preset time window from constant - how far back to look
 * @param {*} interval  // the chunk size in seconds - default is 1 hour of 3600s
 */
export function useTokenPriceData(tokenAddress: string, timeWindow: string, interval = 3600) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const chartData = useAppSelector(
    state => state.token[activeNetwork]?.[tokenAddress]?.timeWindowData?.[timeWindow]?.[interval]
  )

  useEffect(() => {
    const currentTime = dayjs.utc()
    const subtractUnit = timeWindow === timeframeOptions.YEAR ? 'year' : 'hour'
    const startTime = currentTime.subtract(1, timestampUnitType[timeWindow]).startOf(subtractUnit).unix()

    async function fetchData() {
      const data = await DataService.tokens.getIntervalTokenData(tokenAddress, startTime, interval)
      dispatch(setPriceData({ networkId: activeNetwork, timeWindow, interval, data, address: tokenAddress }))
    }
    if (!chartData) {
      fetchData()
    }
  }, [chartData, interval, timeWindow, tokenAddress, activeNetwork])

  return chartData
}
