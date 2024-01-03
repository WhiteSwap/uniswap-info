import { useActiveNetworkId } from 'state/features/application/selectors'
import { useAppSelector } from 'state/hooks'
import { getPercentChange } from 'utils'
import { calculateDayFees } from 'utils/pair'

export function useGlobalChartDataSelector() {
  const activeNetwork = useActiveNetworkId()
  return useAppSelector(state => state.global[activeNetwork]?.chartData || [])
}

export function useGlobalTransactionsSelector() {
  const activeNetwork = useActiveNetworkId()
  return useAppSelector(state => state.global[activeNetwork]?.transactions)
}

export function useActiveTokenPrice() {
  const activeNetwork = useActiveNetworkId()
  return useAppSelector(state => state.global[activeNetwork]?.price)
}

export function useDayVolumeUsd() {
  const activeNetwork = useActiveNetworkId()
  return useAppSelector(state => {
    const chart = state.global[activeNetwork]?.chartData
    if (chart) {
      const currentChartData = chart.at(-1)
      return currentChartData?.dailyVolumeUSD
    }
    return 0
  })
}

export function useTotalLiquidityUsd() {
  const activeNetwork = useActiveNetworkId()
  return useAppSelector(state => {
    const chart = state.global[activeNetwork]?.chartData
    if (chart) {
      const currentChartData = chart.at(-1)
      return currentChartData?.totalLiquidityUSD
    }
    return 0
  })
}

export function useVolumeChangeUsd() {
  const activeNetwork = useActiveNetworkId()
  return useAppSelector(state => {
    const chart = state.global[activeNetwork]?.chartData
    if (chart) {
      const currentVolume = chart.at(-1)?.dailyVolumeUSD
      const previousVolume = chart.at(-2)?.dailyVolumeUSD
      if (previousVolume) {
        return getPercentChange(currentVolume, previousVolume)
      }
    }
    return null
  })
}

export function useLiquidityChangeUsd() {
  const activeNetwork = useActiveNetworkId()
  return useAppSelector(state => {
    const chart = state.global[activeNetwork]?.chartData
    if (chart) {
      const currentLiquidity = chart.at(-1)?.totalLiquidityUSD
      const previousLiquidity = chart.at(-2)?.totalLiquidityUSD
      if (previousLiquidity) {
        return getPercentChange(currentLiquidity, previousLiquidity)
      }
    }
    return null
  })
}

export function useDayFeesUsd() {
  const dayVolumeUsd = useDayVolumeUsd()
  return calculateDayFees(dayVolumeUsd)
}
