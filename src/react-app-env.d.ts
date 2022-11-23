/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnvironment {
    REACT_APP_TRON_API: string
    REACT_APP_GOOGLE_ANALYTICS_ID: string
  }
}

declare enum SupportedNetwork {
  ETHEREUM = 'eth',
  TRON = 'trx'
}

type TransactionType = 'swap' | 'mint' | 'burn' | 'all'

type BlockHeight = {
  timestamp: string
  number: number
}

type OffsetParameters<T> = T & {
  skip: number
}

type ParametersWithNetwork<T = unknown> = T & {
  networkId: SupportedNetwork
}

interface TransactionData {
  pair: {
    token0: Pick<Token, 'symbol' | 'id'>
    token1: Pick<Token, 'symbol' | 'id'>
  }
  transaction: {
    timestamp: string
    id: string
  }
  to: string
}

interface BurnTransaction extends TransactionData {
  amount0: string
  amount1: string
  amountUSD: string
  sender: string
}

interface MintTransaction extends TransactionData {
  amount0: string
  amount1: string
  amountUSD: string
}

interface SwapTransaction extends TransactionData {
  amount0In: string
  amount0Out: string
  amount1In: string
  amount1Out: string
  amountUSD: string
}

interface Transaction {
  hash: string
  timestamp: number
  tokenOne: Pick<Token, 'id' | 'symbol'> & { amount: number }
  tokenTwo: Pick<Token, 'id' | 'symbol'> & { amount: number }
  amountUSD: number
  account: string
  type: TransactionType
}

interface Transactions {
  burns: Transaction[]
  mints: Transaction[]
  swaps: Transaction[]
}

interface RawTransactions {
  burns: BurnTransaction[]
  mints: MintTransaction[]
  swaps: SwapTransaction[]
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
  dayVolumeUSD: number
  totalLiquidityUSD: number
  priceUSD: number
  liquidityChangeUSD: number
  volumeChangeUSD: number
  priceChangeUSD: number
  oneDayTxns: number
  txnChange: number
  oneDayVolumeUT?: number
  volumeChangeUT?: number
}

interface TokenDayData {
  dailyVolumeUSD: number
  date: number
  id?: string
  priceUSD: string
  totalLiquidityUSD: string
}

type PairToken = Pick<Token, 'id' | 'symbol' | 'name'> & {
  reserve: number
  price: number
  priceUSD: number
}

interface Pair {
  id: string
  totalLiquidityUSD: number
  liquidityChangeUSD: number
  dayVolumeUSD: number
  volumeChangeUSD: number
  weekVolumeUSD: number
  dayFees: number
  apy: number
  totalSupply: number
  tokenOne: PairToken
  tokenTwo: PairToken
  oneDayVolumeUntracked?: number
  untrackedVolumeUSD?: number
  volumeChangeUntracked?: number
  trackedReserveUSD?: number
  // TODO: remove after mvp
  createdAtTimestamp?: number
  reserveUSD: number
}

type PositionPair = Pick<Pair, 'id' | 'reserveUSD' | 'totalSupply'> & {
  tokenOne: PairToken
  tokenTwo: PairToken
}

type SnapshotPairToken = Pick<Token, 'id' | 'reserve' | 'priceUSD'>

type SnapshotPair = Pick<Pair, 'id' | 'reserveUSD'> & {
  tokenOne: SnapshotPairToken
  tokenTwo: SnapshotPairToken
}

type PositionToken = Pick<Token, 'symbol' | 'id'> & {
  amount: number
  fee: number
}

interface Position {
  pairAddress: string
  tokenOne: PositionToken
  tokenTwo: PositionToken
  totalUsd: number
  totalFeeUsd: number
}

interface LiquiditySnapshot {
  liquidityTokenBalance: number
  liquidityTokenTotalSupply: number
  pair: SnapshotPair
  reserveUSD: number
  reserveOne: number
  reserveTwo: number
  timestamp: number
}

interface LiquidityPosition {
  account: string
  amount: number
  pair: Pick<Pair, 'id'> & {
    tokenOne: Pick<Token, 'id' | 'symbol'>
    tokenTwo: Pick<Token, 'id' | 'symbol'>
  }
}

interface ChartDailyItem {
  date: number
  dailyVolumeUSD: number
  totalLiquidityUSD: number
}

type PairReturn = {
  date: number
  fees: number
  totalLiquidityUsd: number
}
