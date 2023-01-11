export function calculateApy(dayVolumeUSD?: number, totalLiquidityUSD?: number | string): number {
  let apy = 0

  if (dayVolumeUSD && totalLiquidityUSD && +totalLiquidityUSD) {
    apy = (+dayVolumeUSD * 0.003 * 365 * 100) / +totalLiquidityUSD
  }

  return apy
}

export function calculateDayFees(dayVolumeUSD?: number): number {
  return +(dayVolumeUSD || 0) * 0.003
}

export function calculateTokenPrice(reserveOne?: string, reserveTwo?: string): number {
  return reserveOne && reserveTwo ? +reserveOne / +reserveTwo : 0
}

export function calculatePoolShare(balance: string, totalSupply: string): number {
  if (!Number.isNaN(balance) && !Number.isNaN(totalSupply)) {
    return +balance / +totalSupply
  }
  return 0
}

export function calculateTokenAmount(balance: string, totalSupply: string, reserve: string): number {
  if (!Number.isNaN(reserve)) {
    const poolShare = calculatePoolShare(balance, totalSupply)
    return poolShare * +reserve
  }
  return 0
}

export function getPairName(tokenOneSymbol: string, tokenTwoSymbol: string, isReversedPair = false): string {
  return isReversedPair ? `${tokenTwoSymbol}-${tokenOneSymbol}` : `${tokenOneSymbol}-${tokenTwoSymbol}`
}
