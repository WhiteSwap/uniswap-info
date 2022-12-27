import { EthereumPosition } from 'data/controllers/types/ethTypes'
import { pairMapper } from 'data/mappers/ethereum/pairMappers'

export function userPositionMapper(payload: EthereumPosition, price: number): Position {
  return {
    pair: pairMapper(payload?.pair, price),
    liquidityTokenBalance: payload?.liquidityTokenBalance ? +payload.liquidityTokenBalance : 0,
    feeEarned: payload?.feeEarned ? +payload.feeEarned : 0
  }
}

export function userPositionListMapper(price: number, payload?: EthereumPosition[] | null): Position[] {
  return payload?.map(position => userPositionMapper(position, price)) || []
}

export function liquiditySnapshotMapper(payload: any | null): LiquiditySnapshot {
  return {
    liquidityTokenBalance: +payload?.liquidityTokenBalance || 0,
    liquidityTokenTotalSupply: +payload?.liquidityTokenTotalSupply || 0,
    pair: {
      id: payload?.pair.id || '',
      reserveUSD: payload?.pair.reserveUSD || '',
      tokenOne: {
        id: payload?.pair.token0.id || '',
        reserve: payload?.pair.reserve0 || '',
        priceUSD: +payload?.token0PriceUSD || 0
      },
      tokenTwo: {
        id: payload?.pair.token1.id || '',
        reserve: payload?.pair.reserve1 || '',
        priceUSD: payload?.token1PriceUSD || 0
      }
    },
    reserveOne: +payload?.reserve0 || 0,
    reserveTwo: +payload?.reserve1 || 0,
    reserveUSD: payload?.reserveUSD || '',
    timestamp: payload?.timestamp || Date.now()
  }
}

export function liquiditySnapshotListMapper(payload: any[] | null): LiquiditySnapshot[] {
  return payload?.map(snapshot => liquiditySnapshotMapper(snapshot)) || []
}
