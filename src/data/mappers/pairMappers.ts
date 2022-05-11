import { MappedPair } from './pairMappers.types'

export function pairMapper(payload: any): MappedPair {
  return {
    id: payload.id ? payload.id.toString() : '',
    token0: {
      id: payload.token0?.id ? payload.token0.id.toString() : '',
      symbol: payload.token0?.symbol ? payload.token0.symbol.toString() : '',
      name: payload.token0?.name ? payload.token0.name.toString() : '',
      totalLiquidity: 0,
      derivedCoin: payload.token0?.derivedETH
        ? +payload.token0.derivedETH
        : payload.token0?.derivedTRX
        ? +payload.token0.derivedTRX
        : 0,
      __typename: payload.token0?.__typename ? payload.token0.__typename.toString() : ''
    },
    token1: {
      id: payload.token1?.id ? payload.token1?.id.toString() : '',
      symbol: payload.token1?.symbol ? payload.token1.symbol.toString() : '',
      name: payload.token1?.name ? payload.token1.name.toString() : '',
      totalLiquidity: 0,
      derivedCoin: payload.token1?.derivedETH
        ? +payload.token1.derivedETH
        : payload.token1?.derivedTRX
        ? +payload.token1.derivedTRX
        : 0,
      __typename: payload.token1?.__typename ? payload.token1.__typename.toString() : ''
    },
    reserve0: payload.reserve0 ? payload.reserve0.toString() : '',
    reserve1: payload.reserve1 ? payload.reserve1.toString() : '',
    reserveUSD: payload.reserveUSD ? payload.reserveUSD.toString() : '',
    totalSupply: payload.totalSupply ? payload.totalSupply.toString() : '',
    trackedReserveCoin: payload.trackedReserveCoin ? payload.trackedReserveCoin.toString() : '',
    volumeUSD: payload.volumeUSD ? payload.volumeUSD.toString() : '',
    untrackedVolumeUSD: payload.untrackedVolumeUSD ? payload.untrackedVolumeUSD.toString() : '',
    token0Price: payload.token0Price ? payload.token0Price.toString() : '',
    token1Price: payload.token1Price ? payload.token1Price.toString() : '',
    createdAtTimestamp: payload.createdAtTimestamp ? payload.createdAtTimestamp.toString() : '',
    oneDayVolumeUSD: payload.oneDayVolumeUSD ? +payload.oneDayVolumeUSD : 0,
    oneWeekVolumeUSD: payload.oneWeekVolumeUSD ? +payload.oneWeekVolumeUSD : 0,
    volumeChangeUSD: payload.volumeChangeUSD ? +payload.volumeChangeUSD : 0,
    oneDayVolumeUntracked: payload.oneDayVolumeUntracked ? +payload.oneDayVolumeUntracked : 0,
    volumeChangeUntracked: payload.volumeChangeUntracked ? +payload.volumeChangeUntracked : 0,
    trackedReserveUSD: payload.trackedReserveUSD ? +payload.trackedReserveUSD : 0,
    liquidityChangeUSD: payload.liquidityChangeUSD ? +payload.liquidityChangeUSD : 0,
    __typename: payload.__typename ? payload.__typename.toString() : ''
  }
}

export function pairListMapper(payload: any[]): MappedPair[] {
  return payload.map(pair => pairMapper(pair))
}
