import { EthereumTokenDayData } from 'data/controllers/types/ethTypes'

export function tokenDayDataMapper(payload: EthereumTokenDayData): TokenDayData {
  return {
    date: payload.date ?? Date.now(),
    totalLiquidityUSD: payload.totalLiquidityUSD ? payload.totalLiquidityUSD.toString() : '',
    dailyVolumeUSD: payload.dailyVolumeUSD ? +payload.dailyVolumeUSD : 0
  }
}

export function tokenChartDataMapper(payload: EthereumTokenDayData[]): TokenDayData[] {
  return payload.map(token => tokenDayDataMapper(token))
}
