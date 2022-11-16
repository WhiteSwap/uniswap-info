import {
  SnapshotPriceOpenClose,
  Token as TronToken,
  TokenDailyData,
  TokenDailyDataQuery,
  TokensQuery
} from 'service/generated/tronGraphql'
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

export function tokenDayDataMapper(payload?: TokenDailyData): TokenDayData {
  return {
    date: payload?.date ?? Date.now(),
    priceUSD: '',
    totalLiquidityUSD: payload?.liquidity ? payload?.liquidity.toString() : '',
    dailyVolumeUSD: payload?.volume ? +payload?.volume : 0
  }
}

export function tokenChartDataMapper(payload: TokenDailyDataQuery): TokenDayData[] {
  return payload.tokenDailyData?.map(token => tokenDayDataMapper(token)) || []
}

export function tokenPriceDataMapper(payload?: SnapshotPriceOpenClose[] | null): TimeWindowItem[] {
  return (
    payload?.map(chartData => ({
      timestamp: chartData.timestamp.toString(),
      close: chartData.close,
      open: chartData.open
    })) || []
  )
}
