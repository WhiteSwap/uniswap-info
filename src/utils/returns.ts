import { pairMapper } from 'data/mappers/ethereum/pairMappers'

export const priceOverrides = [
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
  '0x6b175474e89094c44da98b954eedeac495271d0f' // DAI
]

interface ReturnMetrics {
  hodleReturn: number // difference in asset values t0 -> t1 with t0 deposit amounts
  netReturn: number // net return from t0 -> t1
  uniswapReturn: number // netReturn - hodlReturn
  impLoss: number
  fees: number
}

const PRICE_DISCOVERY_START_TIMESTAMP = 1_589_747_086

export function formatPricesForEarlyTimestamps(position: LiquiditySnapshot): LiquiditySnapshot {
  const updatedPosition = { ...position }
  if (position.timestamp < PRICE_DISCOVERY_START_TIMESTAMP) {
    if (priceOverrides.includes(position?.pair?.tokenOne.id)) {
      updatedPosition.pair.tokenTwo.priceUSD = 1
    }
    if (priceOverrides.includes(position?.pair?.tokenTwo.id)) {
      updatedPosition.pair.tokenOne.priceUSD = 1
    }
  }
  return updatedPosition
}

/**
 * Core algorithm for calculating retursn within one time window.
 * @param positionT0 // users liquidity info and token rates at beginning of window
 * @param positionT1 // '' at the end of the window
 */
export function getMetricsForPositionWindow(posT0: LiquiditySnapshot, posT1: LiquiditySnapshot): ReturnMetrics {
  const positionT0 = formatPricesForEarlyTimestamps(posT0)
  const positionT1 = formatPricesForEarlyTimestamps(posT1)

  // calculate ownership at ends of window, for end of window we need original LP token balance / new total supply
  const t0Ownership = positionT0.liquidityTokenBalance / positionT0.liquidityTokenTotalSupply
  const t1Ownership = positionT0.liquidityTokenBalance / positionT1.liquidityTokenTotalSupply

  // get starting amounts of token0 and token1 deposited by LP
  const token0_amount_t0 = t0Ownership * positionT0.reserveOne
  const token1_amount_t0 = t0Ownership * positionT0.reserveTwo

  // get current token values
  const token0_amount_t1 = t1Ownership * positionT1.reserveOne
  const token1_amount_t1 = t1Ownership * positionT1.reserveTwo

  // calculate squares to find imp loss and fee differences
  const sqrK_t0 = Math.sqrt(token0_amount_t0 * token1_amount_t0)

  const priceRatioT1 =
    positionT1.pair.tokenOne.priceUSD !== 0 ? positionT1.pair.tokenTwo.priceUSD / positionT1.pair.tokenOne.priceUSD : 0

  const token0_amount_no_fees =
    positionT1.pair.tokenTwo.priceUSD && priceRatioT1 ? sqrK_t0 * Math.sqrt(priceRatioT1) : 0
  const token1_amount_no_fees =
    positionT1.pair.tokenTwo.priceUSD && priceRatioT1 ? sqrK_t0 / Math.sqrt(priceRatioT1) : 0
  const no_fees_usd =
    token0_amount_no_fees * positionT1.pair.tokenOne.priceUSD +
    token1_amount_no_fees * positionT1.pair.tokenTwo.priceUSD

  const difference_fees_token0 = token0_amount_t1 - token0_amount_no_fees
  const difference_fees_token1 = token1_amount_t1 - token1_amount_no_fees
  const difference_fees_usd =
    difference_fees_token0 * positionT1.pair.tokenOne.priceUSD +
    difference_fees_token1 * positionT1.pair.tokenTwo.priceUSD

  // calculate USD value at t0 and t1 using initial token deposit amounts for asset return
  const assetValueT0 =
    token0_amount_t0 * positionT0.pair.tokenOne.priceUSD + token1_amount_t0 * positionT0.pair.tokenTwo.priceUSD
  const assetValueT1 =
    token0_amount_t0 * positionT1.pair.tokenOne.priceUSD + token1_amount_t0 * positionT1.pair.tokenTwo.priceUSD

  const imp_loss_usd = no_fees_usd - assetValueT1
  const uniswap_return = difference_fees_usd + imp_loss_usd

  // get net value change for combined data
  const netValueT0 = t0Ownership * positionT0.pair.reserveUSD
  const netValueT1 = t1Ownership * positionT1.pair.reserveUSD

  return {
    hodleReturn: assetValueT1 - assetValueT0,
    netReturn: netValueT1 - netValueT0,
    uniswapReturn: uniswap_return,
    impLoss: imp_loss_usd,
    fees: difference_fees_usd
  }
}

/**
 * For a given pair and user, get the return metrics
 * @param pair
 * @param ethPrice
 * @param snapshots
 */
export function getLPReturnsOnPair(pair: any, ethPrice: number, snapshots: any) {
  let fees = 0

  snapshots = snapshots.filter((entry: any) => {
    return entry.pair.id === pair.id
  })

  const currentPosition: LiquiditySnapshot = {
    pair: pairMapper(pair, ethPrice),
    liquidityTokenBalance: snapshots[snapshots.length - 1]?.liquidityTokenBalance,
    reserveOne: pair.reserve0,
    reserveTwo: pair.reserve1,
    reserveUSD: pair.reserveUSD,
    liquidityTokenTotalSupply: pair.totalSupply,
    timestamp: 0
  }

  for (const index in snapshots) {
    // get positions at both bounds of the window
    const positionT0 = snapshots[index]
    const positionT1 =
      Number.parseInt(index) === snapshots.length - 1 ? currentPosition : snapshots[Number.parseInt(index) + 1]

    const results = getMetricsForPositionWindow(positionT0, positionT1)
    fees += results.fees
  }

  return fees
}
