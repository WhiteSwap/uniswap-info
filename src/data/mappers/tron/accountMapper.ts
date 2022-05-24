import { TronPosition } from 'data/controllers/types/trxTypes'
import { pairMapper } from 'data/mappers/tron/pairMappers'

export function userPositionMapper(payload: TronPosition | null): Position {
  return {
    pair: pairMapper(payload?.pair),
    liquidityTokenBalance: payload?.liquidityTokenBalance ?? '',
    feeEarned: payload?.feeEarned ?? 0
  }
}

export function userPositionListMapper(payload?: TronPosition[] | null): Position[] {
  return payload?.map(position => userPositionMapper(position)) || []
}

export function liquiditySnapshotMapper(payload: any | null): LiquiditySnapshot {
  return {
    liquidityTokenBalance: payload?.liquidityTokenBalance || '',
    liquidityTokenTotalSupply: payload?.liquidityTokenTotalSupply || '',
    pair: {
      id: payload?.pair.id || '',
      reserveUSD: payload?.pair.reserveUSD || '',
      tokenOne: {
        id: payload?.pair.tokenOne?.id || '',
        reserve: payload?.pair.tokenOne?.reserve || '',
        priceUSD: payload?.pair.tokenOne?.priceUSD || 0
      },
      tokenTwo: {
        id: payload.pair.tokenTwo?.id || '',
        reserve: payload.pair.tokenTwo?.reserve || '',
        priceUSD: payload.pair.tokenTwo?.priceUSD || 0
      }
    },
    reserveUSD: payload.reserveUSD || '',
    timestamp: payload.timestamp || new Date().getTime()
  }
}

export function liquiditySnapshotListMapper(payload: any[] | null): LiquiditySnapshot[] {
  return payload?.map(snapshot => liquiditySnapshotMapper(snapshot)) || []
}

export function liquidityPositionMapper(payload: any | null): LiquidityPosition {
  return {
    pairAddress: payload?.pairAddress ?? '',
    pairName: payload?.pairName ?? '',
    tokenOne: payload?.tokenOne ?? '',
    tokenTwo: payload?.tokenTwo ?? '',
    usd: payload?.usd ? +payload.usd : 0,
    userId: payload?.user?.id ?? ''
  }
}

export function liquidityPositionListMapper(payload: any[] | null): LiquidityPosition[] {
  return payload?.map(position => liquidityPositionMapper(position)) || []
}
