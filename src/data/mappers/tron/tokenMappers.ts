import { Token as TronToken, TokensQuery } from 'service/generated/tronGraphql'
import { parseTokenInfo } from 'utils'

export function tokenMapper(payload?: TronToken | null): Token {
  return {
    id: payload?.id || '',
    name: parseTokenInfo('name', payload?.id, payload?.name),
    symbol: parseTokenInfo('symbol', payload?.id, payload?.symbol),
    derivedPrice: payload?.derivedTRX ? +payload.derivedTRX : 0,
    tradeVolumeUSD: payload?.tradeVolumeUSD ? +payload.tradeVolumeUSD : 0,
    priceUSD: payload?.priceUSD ? +payload.priceUSD : 0,
    totalLiquidityUSD: payload?.totalLiquidityUSD ? +payload.totalLiquidityUSD : 0,
    volumeChangeUSD: payload?.volumeChangeUSD ? +payload.volumeChangeUSD : 0,
    priceChangeUSD: payload?.priceChangeUSD ? +payload.priceChangeUSD : 0,
    liquidityChangeUSD: payload?.liquidityChangeUSD ? +payload.liquidityChangeUSD : 0,
    oneDayTxns: payload?.oneDayTxns ? +payload.oneDayTxns : 0,
    txnChange: payload?.txnChange ? +payload.txnChange : 0
  }
}

export function topTokensMapper(payload?: TokensQuery): Token[] {
  return payload?.tokens?.map(token => tokenMapper(token!)) || []
}

export function tokenDayDataMapper(payload: any): TokenDayData {
  return {
    id: payload.id ? payload.id.toString() : '',
    date: payload.date ?? new Date().getTime(),
    priceUSD: payload.priceUSD ? payload.priceUSD.toString() : '',
    totalLiquidityToken: payload.totalLiquidityToken ? payload.totalLiquidityToken.toString() : '',
    totalLiquidityUSD: payload.totalLiquidityUSD ? payload.totalLiquidityUSD.toString() : '',
    totalLiquidityCoin: payload.totalLiquidityTRX ? payload.totalLiquidityTRX.toString() : '',
    dailyVolumeCoin: payload.dailyVolumeTRX ? payload.dailyVolumeTRX.toString() : '',
    dailyVolumeToken: payload.dailyVolumeToken ? payload.dailyVolumeToken.toString() : '',
    dailyVolumeUSD: payload.dailyVolumeUSD ? +payload.dailyVolumeUSD : 0
  }
}

export function tokenChartDataMapper(payload: any[]): TokenDayData[] {
  return payload.map(token => tokenDayDataMapper(token))
}
