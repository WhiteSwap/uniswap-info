import { EthereumPosition } from 'data/controllers/types/ethTypes'
import { pairMapper } from 'data/mappers/ethereum/pairMappers'

export function userPositionMapper(payload: EthereumPosition): Position {
  return {
    pair: pairMapper(payload.pair),
    liquidityTokenBalance: payload.liquidityTokenBalance ?? '',
    feeEarned: payload.feeEarned ?? 0
  }
}

export function userPositionListMapper(payload?: EthereumPosition[] | null): Position[] {
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
