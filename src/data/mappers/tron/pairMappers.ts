export function pairMapper(payload: any): Pair {
  return {
    id: payload.id || '',
    tokenOne: {
      id: payload.token0?.id || '',
      symbol: payload.token0?.symbol || '',
      price: 0,
      priceUSD: 0
    },
    tokenTwo: {
      id: payload.token1?.id || '',
      symbol: payload.token1?.symbol || '',
      price: 0,
      priceUSD: 0
    },
    dayFees: +payload.oneDayVolumeUSD * 0.003,
    apy: (+payload.oneDayVolumeUSD * 0.003 * 365 * 100) / +payload.reserveUSD,
    reserveOne: payload.reserve0 ? +payload.reserve0 : 0,
    reserveTwo: payload.reserve1 ? +payload.reserve1 : 0,
    totalSupply: +payload.totalSupply || 0,
    totalLiquidityUSD: payload.reserveUSD ? +payload.reserveUSD : 0,
    untrackedVolumeUSD: payload.untrackedVolumeUSD ? payload.untrackedVolumeUSD.toString() : '',
    dayVolumeUSD: payload.oneDayVolumeUSD ? +payload.oneDayVolumeUSD : 0,
    weekVolumeUSD: payload.oneWeekVolumeUSD ? +payload.oneWeekVolumeUSD : 0,
    volumeChangeUSD: payload.volumeChangeUSD ? +payload.volumeChangeUSD : 0,
    oneDayVolumeUntracked: payload.oneDayVolumeUntracked ? +payload.oneDayVolumeUntracked : 0,
    volumeChangeUntracked: payload.volumeChangeUntracked ? +payload.volumeChangeUntracked : 0,
    liquidityChangeUSD: payload.liquidityChangeUSD ? +payload.liquidityChangeUSD : 0
  }
}

export function pairListMapper(payload: any[]): Pair[] {
  return payload.map(pair => pairMapper(pair))
}
