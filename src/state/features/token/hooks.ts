import { timeframeOptions } from '../../../constants'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useActiveNetworkId, useLatestBlock } from '../application/selectors'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { setTokenPairs, setChartData, setPriceData, setToken, setTopTokens, setTransactions } from './slice'
import { useActiveTokenPrice } from '../global/selectors'
import DataService from 'data/DataService'
import { isValidAddress } from 'utils'
import { SupportedNetwork } from 'constants/networks'

export function useFetchTokens() {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const price = useActiveTokenPrice()

  useEffect(() => {
    async function fetchData() {
      // get top pairs for overview list
      const topTokens = await DataService.tokens.getTopTokens(price)
      topTokens && dispatch(setTopTokens({ networkId: activeNetwork, topTokens }))
    }
    price && fetchData()
  }, [price, activeNetwork])
}

export function useTokenData(tokenAddress: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const price = useActiveTokenPrice()
  const tokenData = useAppSelector(state => state.token[activeNetwork]?.[tokenAddress])

  useEffect(() => {
    async function fetchData() {
      const data = await DataService.tokens.getTokenData(tokenAddress, price)
      data && dispatch(setToken({ tokenAddress, networkId: activeNetwork, data }))
    }
    if (!tokenData && price && isValidAddress(tokenAddress, activeNetwork)) {
      fetchData()
    }
  }, [price, tokenAddress, tokenData, activeNetwork])

  return tokenData || {}
}

export function useTokenTransactions(tokenAddress: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const tokenTransactions = useAppSelector(state => state.token[activeNetwork]?.[tokenAddress]?.transactions)
  const tokenPairs = useAppSelector(state => state.token[activeNetwork]?.[tokenAddress]?.tokenPairs)

  useEffect(
    () => {
      async function checkForTransactions() {
        const transactions = await DataService.transactions.getTokenTransactions(tokenAddress, tokenPairs!)
        dispatch(setTransactions({ networkId: activeNetwork, transactions, address: tokenAddress }))
      }
      // eth subgraph need to pass token pairs array
      // tron need to pass only token address
      if (activeNetwork === SupportedNetwork.TRON || tokenPairs) {
        checkForTransactions()
      }
    },
    activeNetwork === SupportedNetwork.ETHEREUM ? [tokenPairs] : []
  )

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

export function useTokenChartData(tokenAddress: string) {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const chartData = useAppSelector(state => state.token[activeNetwork]?.[tokenAddress]?.chartData)
  useEffect(() => {
    async function checkForChartData() {
      if (!chartData) {
        const data = await DataService.tokens.getTokenChartData(tokenAddress)
        dispatch(setChartData({ networkId: activeNetwork, chartData: data, address: tokenAddress }))
      }
    }
    checkForChartData()
  }, [chartData, tokenAddress, chartData])
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
  const latestBlock = useLatestBlock()

  useEffect(() => {
    const currentTime = dayjs.utc()
    const windowSize = timeWindow === timeframeOptions.MONTH ? 'month' : 'week'
    const startTime =
      timeWindow === timeframeOptions.ALL_TIME
        ? 1_589_760_000
        : currentTime.subtract(1, windowSize).startOf('hour').unix()

    async function fetch() {
      const data = await DataService.tokens.getIntervalTokenData(tokenAddress, startTime, interval, latestBlock)
      dispatch(setPriceData({ networkId: activeNetwork, timeWindow, interval, data, address: tokenAddress }))
    }
    if (!chartData && latestBlock) {
      fetch()
    }
  }, [chartData, interval, timeWindow, tokenAddress, latestBlock, activeNetwork])

  return chartData
}
