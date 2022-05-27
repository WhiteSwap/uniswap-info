import { EthereumPair } from 'data/controllers/types/ethTypes'
import { parseTokenInfo } from 'utils'
import { calculateApy, calculateDayFees, calculateTokenPrice } from 'utils/pair'

export function pairMapper(payload: EthereumPair, ethPrice?: number): Pair {
  return {
    id: payload.id || '',
    tokenOne: {
      id: payload.token0?.id || '',
      symbol: parseTokenInfo('symbol', payload.token0?.id, payload.token0?.symbol),
      name: parseTokenInfo('name', payload?.token0?.id, payload?.token0?.name),
      reserve: payload.reserve0 ? +payload.reserve0 : 0,
      price: calculateTokenPrice(payload.reserve1, payload.reserve0),
      priceUSD: ethPrice && payload.token0.derivedETH ? +payload.token0.derivedETH * ethPrice : 0
    },
    tokenTwo: {
      id: payload.token1?.id || '',
      symbol: parseTokenInfo('symbol', payload.token1?.id, payload.token1?.symbol),
      name: parseTokenInfo('name', payload.token1?.id, payload.token1?.name),
      reserve: payload.reserve1 ? +payload.reserve1 : 0,
      price: calculateTokenPrice(payload?.reserve0, payload?.reserve1),
      priceUSD: ethPrice && payload.token1.derivedETH ? +payload.token1.derivedETH * ethPrice : 0
    },
    dayFees: calculateDayFees(payload.oneDayVolumeUSD),
    apy: calculateApy(payload.oneDayVolumeUSD, payload.reserveUSD),
    totalSupply: payload.totalSupply ? +payload.totalSupply : 0,
    totalLiquidityUSD: payload.reserveUSD ? +payload.reserveUSD : 0,
    untrackedVolumeUSD: payload.untrackedVolumeUSD ? +payload.untrackedVolumeUSD.toString() : 0,
    dayVolumeUSD: payload.oneDayVolumeUSD ? +payload.oneDayVolumeUSD : 0,
    weekVolumeUSD: payload.oneWeekVolumeUSD ? +payload.oneWeekVolumeUSD : 0,
    volumeChangeUSD: payload.volumeChangeUSD ? +payload.volumeChangeUSD : 0,
    oneDayVolumeUntracked: payload.oneDayVolumeUntracked ? +payload.oneDayVolumeUntracked : 0,
    volumeChangeUntracked: payload.volumeChangeUntracked ? +payload.volumeChangeUntracked : 0,
    trackedReserveUSD: payload.trackedReserveUSD ? +payload.trackedReserveUSD : 0,
    liquidityChangeUSD: payload.liquidityChangeUSD ? +payload.liquidityChangeUSD : 0,
    reserveUSD: payload.reserveUSD ? +payload.reserveUSD : 0
  }
}

export function pairListMapper(payload: EthereumPair[], ethPrice: number): Pair[] {
  return payload.map(pair => pairMapper(pair, ethPrice))
}
