import {
  PairListQuery,
  Pair as TronPair,
  PairHourlyPriceQuery,
  PairDailyDataQuery,
  PairDailyData
} from 'service/generated/graphql'
import { PairDayData } from 'state/features/pairs/types'
import { parseTokenInfo } from 'utils'
import { calculateApy } from 'utils/pair'

export function pairMapper(payload?: TronPair | null): Pair {
  return {
    id: payload?.id || '',
    totalLiquidityUSD: payload?.totalLiquidityUSD ? +payload.totalLiquidityUSD : 0,
    liquidityChangeUSD: payload?.liquidityChangeUSD ? +payload.liquidityChangeUSD : 0,
    dayVolumeUSD: payload?.dayVolumeUSD ? +payload.dayVolumeUSD : 0,
    volumeChangeUSD: payload?.volumeChangeUSD ? +payload.volumeChangeUSD : 0,
    weekVolumeUSD: payload?.weekVolumeUSD ? +payload.weekVolumeUSD : 0,
    dayFees: payload?.fee ? +payload?.fee : 0,
    dayFeesChange: payload?.volumeFeeChangeUSD ? +payload.volumeFeeChangeUSD : 0,
    apy: calculateApy(payload?.dayVolumeUSD, payload?.totalLiquidityUSD),
    totalSupply: 0,
    tokenOne: {
      id: payload?.tokenOne?.id || '',
      symbol: parseTokenInfo('symbol', payload?.tokenOne?.id, payload?.tokenOne?.symbol),
      name: parseTokenInfo('name', payload?.tokenOne?.id, payload?.tokenOne?.name),
      reserve: payload?.tokenOne.reserve ? +payload.tokenOne.reserve : 0,
      price: payload?.tokenTwo.derivedPrice ? +payload.tokenTwo.derivedPrice : 0,
      priceUSD: payload?.tokenOne.price ? +payload.tokenOne.price : 0
    },
    tokenTwo: {
      id: payload?.tokenTwo?.id || '',
      symbol: parseTokenInfo('symbol', payload?.tokenTwo?.id, payload?.tokenTwo?.symbol),
      name: parseTokenInfo('name', payload?.tokenTwo?.id, payload?.tokenTwo?.name),
      reserve: payload?.tokenTwo.reserve ? +payload.tokenTwo.reserve : 0,
      price: payload?.tokenOne.derivedPrice ? +payload.tokenOne.derivedPrice : 0,
      priceUSD: payload?.tokenTwo.price ? +payload.tokenTwo.price : 0
    },
    oneDayVolumeUntracked: 0,
    untrackedVolumeUSD: 0,
    volumeChangeUntracked: 0,
    trackedReserveUSD: 0,
    reserveUSD: 0,
    isFarming: payload?.isFarming,
    isFullActive: payload?.isFullActive
  }
}

export function pairListMapper(payload: PairListQuery): Pair[] {
  return payload?.pairs?.map(pairMapper) || []
}

export function pairPriceDataMapper(payload: PairHourlyPriceQuery): TimeWindowItem[] {
  return (
    payload?.pairHourlyPrice?.map(chartData => ({
      timestamp: chartData.timestamp.toString(),
      close: chartData.close,
      open: chartData.open
    })) || []
  )
}

export function pairDayDataMapper(payload?: PairDailyData): PairDayData {
  return {
    date: payload?.date ?? Date.now(),
    liquidityUSD: payload?.liquidity ? +payload?.liquidity : 0,
    dailyVolumeUSD: payload?.volume ? +payload?.volume : 0
  }
}

export function pairChartDataMapper(payload: PairDailyDataQuery): PairDayData[] {
  return payload.pairDailyData?.map(token => pairDayDataMapper(token)) || []
}
