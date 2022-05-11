import { MappedToken, MappedTokenDayData } from './tokenMappers.types'

export function tokenMapper(payload: any): MappedToken {
  return {
    id: payload.id ? payload.id.toString() : '',
    name: payload.name ? payload.name.toString() : '',
    symbol: payload.symbol ? payload.symbol.toString() : '',
    derived: payload.derivedETH ? +payload.derivedETH : payload.derivedTRX ? +payload.derivedTRX : 0,
    tradeVolume: payload.tradeVolume ? payload.tradeVolume.toString() : '',
    tradeVolumeUSD: payload.tradeVolumeUSD ? +payload.tradeVolumeUSD : 0,
    untrackedVolumeUSD: payload.untrackedVolumeUSD ? +payload.untrackedVolumeUSD : 0,
    totalLiquidity: payload.totalLiquidity ? payload.totalLiquidity : 0,
    txCount: payload.txCount ? +payload.txCount : 0,
    __typename: payload.__typename ? payload.__typename.toString() : '',
    priceUSD: payload.priceUSD ? +payload.priceUSD : 0,
    totalLiquidityUSD: payload.totalLiquidityUSD ? +payload.totalLiquidityUSD : 0,
    oneDayVolumeUT: payload.oneDayVolumeUT ? +payload.oneDayVolumeUT : 0,
    volumeChangeUT: payload.volumeChangeUT ? +payload.volumeChangeUT : 0,
    oneDayVolumeUSD: payload.oneDayVolumeUSD ? +payload.oneDayVolumeUSD : 0,
    volumeChangeUSD: payload.volumeChangeUSD ? +payload.volumeChangeUSD : 0,
    priceChangeUSD: payload.priceChangeUSD ? +payload.priceChangeUSD : 0,
    liquidityChangeUSD: payload.liquidityChangeUSD ? +payload.liquidityChangeUSD : 0,
    oneDayTxns: payload.oneDayTxns ? +payload.oneDayTxns : 0,
    txnChange: payload.txnChange ? +payload.txnChange : 0
  }
}

export function topTokensMapper(payload: any[]): MappedToken[] {
  return payload.map(token => tokenMapper(token))
}

export function tokenDayDataMapper(payload: any): MappedTokenDayData {
  return {
    id: payload.id ? payload.id.toString() : '',
    date: payload.date ?? new Date().getTime(),
    priceUSD: payload.priceUSD ? payload.priceUSD.toString() : '',
    totalLiquidityToken: payload.totalLiquidityToken ? payload.totalLiquidityToken.toString() : '',
    totalLiquidityUSD: payload.totalLiquidityUSD ? payload.totalLiquidityUSD.toString() : '',
    totalLiquidityNative: payload.totalLiquidityETH
      ? payload.totalLiquidityETH.toString()
      : payload.totalLiquidityTRX
      ? payload.totalLiquidityTRX.toString()
      : '',
    dailyVolumeNative: payload.dailyVolumeETH
      ? payload.dailyVolumeETH.toString()
      : payload.dailyVolumeTRX
      ? payload.dailyVolumeTRX.toString()
      : '',
    dailyVolumeToken: payload.dailyVolumeToken ? payload.dailyVolumeToken.toString() : '',
    dailyVolumeUSD: payload.dailyVolumeUSD ? +payload.dailyVolumeUSD : 0,
    __typename: payload.__typename ? payload.__typename.toString() : ''
  }
}

export function tokenChartDataMapper(payload: any[]): MappedTokenDayData[] {
  return payload.map(token => tokenDayDataMapper(token))
}
