import { pairMapper } from 'data/mappers/ethereum/pairMappers'
import dayjs from 'dayjs'
import { getShareValueOverTime } from '.'

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

// used to calculate returns within a given window bounded by two positions
// interface Position {
//   pair: any
//   liquidityTokenBalance: number
//   liquidityTokenTotalSupply: number
//   reserve0: number
//   reserve1: number
//   reserveUSD: number
//   token0PriceUSD: number
//   token1PriceUSD: number
// }

const PRICE_DISCOVERY_START_TIMESTAMP = 1589747086

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
 * formats data for historical chart for an LPs position in 1 pair over time
 * @param startDateTimestamp // day to start tracking at
 * @param currentPairData // current stat of the pair
 * @param pairSnapshots // history of entries and exits for lp on this pair
 * @param currentETHPrice // current price of eth used for usd conversions
 */
export async function getHistoricalPairReturns(
  startDateTimestamp: number,
  currentPairData: Pair,
  pairSnapshots: LiquiditySnapshot[]
) {
  // catch case where data not puplated yet
  if (!currentPairData.createdAtTimestamp) {
    return []
  }
  let dayIndex: number = Math.round(startDateTimestamp / 86400) // get unique day bucket unix
  const currentDayIndex: number = Math.round(dayjs.utc().unix() / 86400)
  const sortedPositions = pairSnapshots.sort((a: any, b: any) => {
    return parseInt(a.timestamp) > parseInt(b.timestamp) ? 1 : -1
  })
  if (sortedPositions[0].timestamp > startDateTimestamp) {
    dayIndex = Math.round(sortedPositions[0].timestamp / 86400)
  }

  const dayTimestamps = []
  while (dayIndex < currentDayIndex) {
    // only account for days where this pair existed
    if (dayIndex * 86400 >= currentPairData?.createdAtTimestamp) {
      dayTimestamps.push(dayIndex * 86400)
    }
    dayIndex = dayIndex + 1
  }

  const shareValues = await getShareValueOverTime(currentPairData.id, dayTimestamps)
  const shareValuesFormatted: any = {}
  shareValues &&
    shareValues.forEach(share => {
      shareValuesFormatted[share.timestamp] = share
    })

  // set the default position and data
  let positionT0 = pairSnapshots[0]
  const formattedHistory = []
  let netFees = 0

  // keep track of up to date metrics as we parse each day
  for (const index in dayTimestamps) {
    // get the bounds on the day
    const dayTimestamp = dayTimestamps[index]
    const timestampCeiling = dayTimestamp + 86400

    // for each change in position value that day, create a window and update
    const dailyChanges = pairSnapshots.filter((snapshot: any) => {
      return snapshot.timestamp < timestampCeiling && snapshot.timestamp > dayTimestamp
    })
    for (let i = 0; i < dailyChanges.length; i++) {
      const positionT1: LiquiditySnapshot = dailyChanges[i]
      const localReturns = getMetricsForPositionWindow(positionT0, positionT1)
      netFees = netFees + localReturns.fees
      positionT0 = positionT1
    }

    // now treat the end of the day as a hypothetical position
    let positionT1: LiquiditySnapshot = shareValuesFormatted[dayTimestamp + 86400]
    if (!positionT1) {
      positionT1 = {
        timestamp: 0,
        pair: currentPairData,
        liquidityTokenBalance: positionT0.liquidityTokenBalance,
        reserveOne: currentPairData.tokenOne.reserve,
        reserveTwo: currentPairData.tokenTwo.reserve,
        reserveUSD: currentPairData.reserveUSD,
        liquidityTokenTotalSupply: currentPairData.totalSupply
      }
    }

    if (positionT1) {
      positionT1.liquidityTokenBalance = positionT0.liquidityTokenBalance
      const currentLiquidityValue =
        (positionT1.liquidityTokenBalance / positionT1.liquidityTokenTotalSupply) * positionT1.reserveUSD
      const localReturns = getMetricsForPositionWindow(positionT0, positionT1)
      const localFees = netFees + localReturns.fees

      formattedHistory.push({
        date: dayTimestamp,
        usdValue: currentLiquidityValue,
        fees: localFees
      })
    }
  }

  return formattedHistory
}

/**
 * For a given pair and user, get the return metrics
 * @param pair
 * @param ethPrice
 * @param snapshots
 */
export async function getLPReturnsOnPair(pair: any, ethPrice: number, snapshots: any) {
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
    const positionT1 = parseInt(index) === snapshots.length - 1 ? currentPosition : snapshots[parseInt(index) + 1]

    const results = getMetricsForPositionWindow(positionT0, positionT1)
    fees += results.fees
  }

  return fees
}
