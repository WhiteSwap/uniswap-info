import { EthereumTokenDayData } from 'data/controllers/types/ethTypes'

export function tokenDayDataMapper(payload: EthereumTokenDayData): TokenDayData {
  return {
    id: payload.id ? payload.id.toString() : '',
    date: payload.date ?? new Date().getTime(),
    priceUSD: payload.priceUSD ? payload.priceUSD.toString() : '',
    totalLiquidityToken: payload.totalLiquidityToken ? payload.totalLiquidityToken.toString() : '',
    totalLiquidityUSD: payload.totalLiquidityUSD ? payload.totalLiquidityUSD.toString() : '',
    totalLiquidityCoin: payload.totalLiquidityETH ? payload.totalLiquidityETH.toString() : '',
    dailyVolumeCoin: payload.dailyVolumeETH ? payload.dailyVolumeETH.toString() : '',
    dailyVolumeToken: payload.dailyVolumeToken ? payload.dailyVolumeToken.toString() : '',
    dailyVolumeUSD: payload.dailyVolumeUSD ? +payload.dailyVolumeUSD : 0
  }
}

export function tokenChartDataMapper(payload: EthereumTokenDayData[]): TokenDayData[] {
  return payload.map(token => tokenDayDataMapper(token))
}
