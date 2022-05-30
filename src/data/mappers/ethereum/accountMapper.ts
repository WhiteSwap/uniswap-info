import { EthereumPosition } from 'data/controllers/types/ethTypes'
import { pairMapper } from 'data/mappers/ethereum/pairMappers'

export function userPositionMapper(payload: EthereumPosition): Position {
  return {
    pair: pairMapper(payload?.pair),
    liquidityTokenBalance: payload?.liquidityTokenBalance ? +payload.liquidityTokenBalance : 0,
    feeEarned: payload?.feeEarned ? +payload.feeEarned : 0
  }
}

export function userPositionListMapper(payload?: EthereumPosition[] | null): Position[] {
  return payload?.map(position => userPositionMapper(position)) || []
}

export function liquiditySnapshotMapper(payload: any | null): LiquiditySnapshot {
  return {
    liquidityTokenBalance: payload?.liquidityTokenBalance || 0,
    liquidityTokenTotalSupply: payload?.liquidityTokenTotalSupply || 0,
    pair: {
      id: payload?.pair.id || '',
      reserveUSD: payload?.pair.reserveUSD || '',
      tokenOne: {
        id: payload?.pair.token0.id || '',
        reserve: payload?.pair.reserve0 || '',
        priceUSD: payload?.token0PriceUSD || 0
      },
      tokenTwo: {
        id: payload?.pair.token1.id || '',
        reserve: payload?.pair.reserve1 || '',
        priceUSD: payload?.token1PriceUSD || 0
      }
    },
    reserveUSD: payload?.reserveUSD || '',
    timestamp: payload?.timestamp || new Date().getTime()
  }
}

export function liquiditySnapshotListMapper(payload: any[] | null): LiquiditySnapshot[] {
  return payload?.map(snapshot => liquiditySnapshotMapper(snapshot)) || []
}

export function liquidityPositionMapper(payload: any | null): LiquidityPosition {
  return {
    pairAddress: payload?.pairAddress ?? '',
    pairName: payload?.pairName ?? '',
    tokenOne: payload?.token0 ?? '',
    tokenTwo: payload?.token1 ?? '',
    usd: payload?.usd ? +payload.usd : 0,
    userId: payload?.user?.id ?? ''
  }
}

export function liquidityPositionListMapper(payload: any[] | null): LiquidityPosition[] {
  return payload?.map(position => liquidityPositionMapper(position)) || []
}
