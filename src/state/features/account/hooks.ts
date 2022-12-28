import { useEffect, useState } from 'react'
import DataService from 'data/DataService'
import { useActiveTokenPrice } from 'state/features/global/selectors'
import { usePairData } from 'state/features/pairs/hooks'
import { usePairs } from 'state/features/pairs/selectors'
import { PositionChartData, PositionPairChartKey } from './types'

// FIXME: remove this file from state/features/account to separate features folder

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
  const [data, setData] = useState<LiquiditySnapshot[] | undefined>(undefined)

  useEffect(() => {
    async function fetchData() {
      const result = await DataService.accounts.getUserHistory(account)
      if (result) {
        setData(result)
      }
    }
    fetchData()
  }, [])

  return data
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
  key: PositionPairChartKey,
  liquiditySnapshots?: LiquiditySnapshot[]
) {
  const [data, setData] = useState<PositionChartData | undefined>(undefined)
  const pairSnapshots = liquiditySnapshots?.filter(currentSnapshot => currentSnapshot.pair.id === pairAddress)
  const currentPairData = usePairData(pairAddress)
  const price = useActiveTokenPrice()
  const chartData = data?.[key]?.[timeWindow]

  useEffect(() => {
    setData(undefined)
  }, [pairAddress])

  useEffect(() => {
    async function fetchData() {
      const fetchedData = await DataService.accounts.getPositionChart(
        account,
        currentPairData,
        timeWindow,
        key,
        pairSnapshots!
      )
      setData(oldChartData => ({
        liquidity: { ...oldChartData?.liquidity, ...fetchedData?.liquidity },
        fee: { ...oldChartData?.fee, ...fetchedData?.fee }
      }))
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
  const [data, setData] = useState<Record<string, LiquidityChart[]> | undefined>(undefined)

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
  const [data, setData] = useState<Position[] | undefined>()
  const price = useActiveTokenPrice()

  useEffect(() => {
    async function fetchData(account: string) {
      const positions = await DataService.accounts.getUserPositions(account, price, liquiditySnapshots!)
      if (positions) {
        setData(positions)
      }
    }
    if (price && liquiditySnapshots) {
      fetchData(account)
    }
  }, [price, Boolean(liquiditySnapshots)])

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
