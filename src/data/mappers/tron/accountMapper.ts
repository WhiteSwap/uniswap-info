import { TronPosition } from 'data/controllers/types/trxTypes'
import { pairMapper } from 'data/mappers/tron/pairMappers'

export function userPositionMapper(payload: TronPosition): Position {
  return {
    pair: pairMapper(payload.pair),
    liquidityTokenBalance: payload.liquidityTokenBalance ?? '',
    feeEarned: payload.feeEarned ?? 0
  }
}

export function userPositionListMapper(payload?: TronPosition[] | null): Position[] {
  return payload?.map(position => userPositionMapper(position)) || []
}

export function liquiditySnapshotMapper(payload: any): LiquiditySnapshot {
  return {
    liquidityTokenBalance: payload.liquidityTokenBalance,
    liquidityTokenTotalSupply: '',
    pair: {
      id: '',
      reserveUSD: '',
      tokenOne: {
        id: '',
        reserve: '',
        priceUSD: 0
      },
      tokenTwo: {
        id: '',
        reserve: '',
        priceUSD: 0
      }
    },
    reserveUSD: '',
    timestamp: 0
  }
}

export function liquiditySnapshotListMapper(payload: any[]): LiquiditySnapshot[] {
  return payload?.map(snapshot => liquiditySnapshotMapper(snapshot)) || []
}

export function liquidityPositionMapper(payload: any): LiquidityPosition {
  return {
    pairAddress: payload.pairAddress ?? '',
    pairName: payload.pairName ?? '',
    tokenOne: payload.token0 ?? '',
    tokenTwo: payload.token1 ?? '',
    usd: payload.usd ? +payload.usd : 0,
    userId: payload.user?.id ?? ''
  }
}

export function liquidityPositionListMapper(payload: any[]): LiquidityPosition[] {
  return payload?.map(position => liquidityPositionMapper(position)) || []
}
