import {
  AccountLiquidityDataQuery,
  AccountPositionChartQuery,
  AccountPositionQuery,
  TopLiquidityPositionsQuery
} from 'service/generated/tronGraphql'
import { parseTokenInfo } from 'utils'

export function liquidityPositionsMapper(payload: TopLiquidityPositionsQuery): LiquidityPosition[] {
  return (
    payload?.topLiquidityPosition?.map(element => ({
      amount: element?.amount ? +element.amount : 0,
      account: element?.account || '',
      pair: {
        id: element?.pair?.id || '',
        tokenOne: {
          id: element?.pair?.tokenOne?.id || '',
          symbol: parseTokenInfo('symbol', element?.pair?.tokenOne?.id, element?.pair?.tokenOne?.symbol)
        },
        tokenTwo: {
          id: element?.pair?.tokenTwo?.id || '',
          symbol: parseTokenInfo('symbol', element?.pair?.tokenTwo?.id, element?.pair?.tokenTwo?.symbol)
        }
      }
    })) || []
  )
}

export function positionsMapper(payload: AccountPositionQuery): Position[] {
  return (
    payload.account?.positions?.map(position => ({
      pairAddress: position?.id || '',
      tokenOne: {
        id: position?.tokenOneAddress || '',
        symbol: parseTokenInfo('symbol', position?.tokenOneAddress, position?.tokenOneCode),
        amount: position?.tokenOneAmount ? +position.tokenOneAmount : 0,
        fee: position?.earningFeeTokenOneAmount ? +position.earningFeeTokenOneAmount : 0
      },
      tokenTwo: {
        id: position?.tokenTwoAddress || '',
        symbol: parseTokenInfo('symbol', position?.tokenTwoAddress, position?.tokenTwoCode),
        amount: position?.tokenTwoAmount ? +position?.tokenTwoAmount : 0,
        fee: position?.earningFeeTokenTwoAmount ? +position.earningFeeTokenTwoAmount : 0
      },
      earningFeeTotalUsd: position?.earningFeeTotalUsd ? +position.earningFeeTotalUsd : 0,
      totalUsd: position?.totalUsd ? +position?.totalUsd : 0
    })) || []
  )
}

export function liquidityChartMapper(payload: AccountLiquidityDataQuery): LiquidityChart[] {
  return (
    payload.account?.liquidityData?.map(element => ({
      date: element?.timestamp || 0,
      value: element?.totalLiquidityUSD || 0
    })) || []
  )
}

export function positionChartMapper(payload: AccountPositionChartQuery): PairReturn[] {
  return (
    payload.account?.liquidityPairData?.map(element => ({
      date: element?.timestamp || 0,
      // FIXME: add real value
      fees: 1,
      totalLiquidityUsd: element?.totalLiquidityUSD || 0
    })) || []
  )
}
