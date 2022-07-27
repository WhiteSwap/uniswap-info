import { Token as TronToken, TokenPriceOpenClose, TokensQuery } from 'service/generated/tronGraphql'
import { parseTokenInfo } from 'utils'

export function tokenMapper(payload?: TronToken | null): Token {
  return {
    id: payload?.id || '',
    name: parseTokenInfo('name', payload?.id, payload?.name),
    symbol: parseTokenInfo('symbol', payload?.id, payload?.symbol),
    dayVolumeUSD: payload?.dayVolumeUSD ? +payload.dayVolumeUSD : 0,
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
    date: payload.date ?? Date.now(),
    priceUSD: payload.priceUSD ? payload.priceUSD.toString() : '',
    totalLiquidityUSD: payload.totalLiquidityUSD ? payload.totalLiquidityUSD.toString() : '',
    dailyVolumeUSD: payload.dailyVolumeUSD ? +payload.dailyVolumeUSD : 0
  }
}

export function tokenChartDataMapper(payload: any[]): TokenDayData[] {
  return payload.map(token => tokenDayDataMapper(token))
}

export function tokenPriceDataMapper(payload?: TokenPriceOpenClose[] | null): TimeWindowItem[] {
  return (
    payload?.map(chartData => ({
      timestamp: chartData.date.toString(),
      close: chartData.close,
      open: chartData.open
    })) || []
  )
}
