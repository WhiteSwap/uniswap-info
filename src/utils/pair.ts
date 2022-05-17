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
