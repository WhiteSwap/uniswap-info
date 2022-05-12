/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_TRON_API: string
    REACT_APP_GOOGLE_ANALYTICS_ID: string
  }
}

declare enum SupportedNetwork {
  ETHEREUM = 'eth',
  TRON = 'trx'
}

type BlockHeight = {
  timestamp: string
  number: number
}

type OffsetParams<T> = T & {
  skip: number
}

type ParamsWithNetwork<T = unknown> = T & {
  networkId: SupportedNetwork
}

interface TransactionData {
  pair: {
    token0: Pick<Token, 'symbol'>
    token1: Pick<Token, 'symbol'>
  }
  transaction: Transaction
  to: string
}

interface BurnTransaction extends TransactionData {
  amount0: string
  amount1: string
  amountUSD: string
  liquidity: string
  sender: string
}

interface MintTransaction extends TransactionData {
  amount0: string
  amount1: string
  amountUSD: string
  liquidity: string
}

interface SwapTransactions extends TransactionData {
  amount0In: string
  amount0Out: string
  amount1In: string
  amount1Out: string
  amountUSD: string
}

interface TransactionV2 {
  hash: string
  timestamp: number
  tokenOneAmount: number
  tokenOneSymbol: string
  tokenTwoAmount: number
  tokenTwoSymbol: string
  amountUSD: number
  account: string
}

interface TransactionsV2 {
  burns: TransactionV2[]
  mints: TransactionV2[]
  swaps: TransactionV2[]
}

interface Transactions {
  burns: BurnTransaction[]
  mints: MintTransaction[]
  swaps: SwapTransactions[]
}

interface TimeWindowItem {
  close: number
  open: number
  timestamp: string
}

type TimeWindowData = Record<string, TimeWindowItem[][]>

interface Token {
  id: string
  name: string
  symbol: string
  derived: number
  liquidityChangeUSD: number
  oneDayTxns: number
  oneDayVolumeUSD: number
  oneDayVolumeUT: number
  priceChangeUSD: number
  priceUSD: number
  totalLiquidity: number
  totalLiquidityUSD: number
  tradeVolume: number
  tradeVolumeUSD: number
  txCount: number
  txnChange: number
  untrackedVolumeUSD: number
  volumeChangeUSD: number
  volumeChangeUT: number
  __typename?: string
}

type EthereumToken = Omit<Token, 'derived'> & { derivedETH: number }
type TronToken = Omit<Token, 'derived'> & { derivedTRX: number }

interface TokenDayData {
  dailyVolumeCoin?: string
  dailyVolumeToken?: string
  dailyVolumeUSD: number
  date: number
  id?: string
  priceUSD: string
  totalLiquidityCoin?: string
  totalLiquidityToken?: string
  totalLiquidityUSD: string
  dayString?: number
  __typename?: string
}

type EthereumTokenDayData = Omit<TokenDayData, 'dailyVolumeCoin' | 'totalLiquidityCoin'> & {
  dailyVolumeETH?: string
  totalLiquidityETH?: string
}
type TronTokenDayData = Omit<TokenDayData, 'dailyVolumeCoin' | 'totalLiquidityCoin'> & {
  dailyVolumeTRX?: string
  totalLiquidityTRX?: string
}

type PairToken = Pick<Token, 'derived' | 'id' | 'name' | 'symbol' | 'totalLiquidity'>
type EthereumPairToken = Omit<PairToken, 'derived'> & { derivedETH: number }
type TronPairToken = Omit<PairToken, 'derived'> & { derivedTRX: number }

interface PairV2 {
  id: string
  totalLiquidityUSD: number
  liquidityChangeUSD: number
  dayVolumeUSD: number
  volumeChangeUSD: number
  weekVolumeUSD: number
  dayFees: number
  feeChangeUSD: number
  apy: number
  reserveOne: number
  reserveTwo: number
  tokenOne: Pick<Token, 'id' | 'symbol' | 'derivedETH'>
  tokenTwo: Pick<Token, 'id' | 'symbol' | 'derivedETH'>
  oneDayVolumeUntracked?: number
  untrackedVolumeUSD?: string
  volumeChangeUntracked?: number
}

interface Pair {
  createdAtTimestamp: string
  id: string
  liquidityChangeUSD: number
  oneDayVolumeUSD: number
  oneDayVolumeUntracked: number
  oneWeekVolumeUSD: number
  reserve0: string
  reserve1: string
  reserveUSD: string
  token0: PairToken
  token1: PairToken
  token0Price: string
  token1Price: string
  totalSupply: string
  trackedReserveCoin: string
  trackedReserveUSD: number
  untrackedVolumeUSD: string
  volumeChangeUSD: number
  volumeChangeUntracked: number
  volumeUSD: string
  __typename?: string
}

type EthereumPair = Omit<Pair, 'trackedReserveCoin' | 'token0' | 'token1'> & {
  trackedReserveETH: string
  token0: EthereumPairToken
  token1: EthereumPairToken
}
type TronPair = Omit<Pair, 'trackedReserveCoin' | 'token0' | 'token1'> & {
  trackedReserveTRX: string
  token0: TronPairToken
  token1: TronPairToken
}

type PositionPair = Pick<Pair, 'id' | 'reserve0' | 'reserve1' | 'reserveUSD' | 'totalSupply'>

type SnapshotPair = Pick<Pair, 'id' | 'reserve0' | 'reserve1' | 'reserveUSD'> & {
  token0: Pick<Token, 'id'>
  token1: Pick<Token, 'id'>
}

interface Position {
  pair: PositionPair
  liquidityTokenBalance: string
  feeEarned: number
}

interface LiquiditySnapshot {
  liquidityTokenBalance: string
  liquidityTokenTotalSupply: string
  pair: SnapshotPair
  reserve0: string
  reserve1: string
  reserveUSD: string
  timestamp: number
  token0PriceUSD: string
  token1PriceUSD: string
}

type PairReturn = {
  date: number
  fees: number
  usdValue: number
}

interface LiquidityPosition {
  pairAddress: string
  pairName: string
  token0: string
  token1: string
  usd: number
  user: {
    id: string
  }
}

interface ChartDailyItem {
  date: number
  dailyVolumeUSD: number
  totalLiquidityUSD: number
}
