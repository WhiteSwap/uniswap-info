import { EthereumTokenDayData } from 'data/controllers/types/ethTypes'

export function tokenDayDataMapper(payload: EthereumTokenDayData): TokenDayData {
  return {
    id: payload.id ? payload.id.toString() : '',
    date: payload.date ?? new Date().getTime(),
    priceUSD: payload.priceUSD ? payload.priceUSD.toString() : '',
    totalLiquidityUSD: payload.totalLiquidityUSD ? payload.totalLiquidityUSD.toString() : '',
    dailyVolumeUSD: payload.dailyVolumeUSD ? +payload.dailyVolumeUSD : 0
  }
}

export function tokenChartDataMapper(payload: EthereumTokenDayData[]): TokenDayData[] {
  return payload.map(token => tokenDayDataMapper(token))
}
