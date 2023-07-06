export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type WhiteSwapFactory = {
  __typename?: 'WhiteSwapFactory'
  id: Scalars['ID']
  pairCount: Scalars['Int']
  totalVolumeUSD: Scalars['Float']
  totalVolumeETH: Scalars['Float']
  untrackedVolumeUSD: Scalars['Float']
  totalLiquidityUSD: Scalars['Float']
  totalLiquidityETH: Scalars['Float']
  txCount: Scalars['Int']
}

export type Token = {
  __typename?: 'Token'
  id: Scalars['ID']
  symbol: Scalars['String']
  name: Scalars['String']
  tradeVolume: Scalars['Float']
  tradeVolumeUSD: Scalars['Float']
  untrackedVolumeUSD: Scalars['Float']
  txCount: Scalars['Int']
  totalLiquidity: Scalars['Float']
  derivedETH: Scalars['Float']
}

export type Pair = {
  __typename?: 'Pair'
  id: Scalars['ID']
  token0: Token
  token1: Token
  reserve0: Scalars['Float']
  reserve1: Scalars['Float']
  totalSupply: Scalars['Float']
  reserveETH: Scalars['Float']
  reserveUSD: Scalars['Float']
  trackedReserveETH: Scalars['Float']
  token0Price: Scalars['Float']
  token1Price: Scalars['Float']
  volumeToken0: Scalars['Float']
  volumeToken1: Scalars['Float']
  volumeUSD: Scalars['Float']
  untrackedVolumeUSD: Scalars['Float']
  txCount: Scalars['Int']
  createdAtTimestamp: Scalars['Int']
  createdAtBlockNumber: Scalars['Int']
  liquidityProviderCount: Scalars['Int']
  pairHourData: Array<PairHourData>
  LiquidityPositions: Array<LiquidityPosition>
  LiquidityPositionSnapshots: Array<LiquidityPositionSnapshot>
  mints: Array<Mint>
  burns: Array<Burn>
  swaps: Array<Swap>
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']
  LiquidityPositions?: Maybe<Array<LiquidityPosition>>
  usdSwapped: Scalars['Float']
}

export type LiquidityPosition = {
  __typename?: 'LiquidityPosition'
  id: Scalars['ID']
  user: User
  pair: Pair
  liquidityTokenBalance: Scalars['Float']
}

export type LiquidityPositionSnapshot = {
  __typename?: 'LiquidityPositionSnapshot'
  id: Scalars['ID']
  LiquidityPosition: LiquidityPosition
  timestamp: Scalars['Int']
  block: Scalars['Int']
  user: User
  pair: Pair
  token0PriceUSD: Scalars['Float']
  token1PriceUSD: Scalars['Float']
  reserve0: Scalars['Float']
  reserve1: Scalars['Float']
  reserveUSD: Scalars['Float']
  liquidityTokenTotalSupply: Scalars['Float']
  liquidityTokenBalance: Scalars['Float']
}

export type Transaction = {
  __typename?: 'Transaction'
  id: Scalars['ID']
  blockNumber: Scalars['Int']
  timestamp: Scalars['Int']
  mints: Array<Maybe<Mint>>
  burns: Array<Maybe<Burn>>
  swaps: Array<Maybe<Swap>>
}

export type Mint = {
  __typename?: 'Mint'
  id: Scalars['ID']
  transaction: Transaction
  timestamp: Scalars['Int']
  pair: Pair
  to: Scalars['String']
  liquidity: Scalars['Float']
  sender?: Maybe<Scalars['String']>
  amount0?: Maybe<Scalars['Float']>
  amount1?: Maybe<Scalars['Float']>
  logIndex?: Maybe<Scalars['Int']>
  amountUSD?: Maybe<Scalars['Float']>
  feeTo?: Maybe<Scalars['String']>
  feeLiquidity?: Maybe<Scalars['Float']>
}

export type Burn = {
  __typename?: 'Burn'
  id: Scalars['ID']
  transaction: Transaction
  timestamp: Scalars['Int']
  pair: Pair
  liquidity: Scalars['Float']
  sender?: Maybe<Scalars['String']>
  amount0?: Maybe<Scalars['Float']>
  amount1?: Maybe<Scalars['Float']>
  to?: Maybe<Scalars['String']>
  logIndex?: Maybe<Scalars['Int']>
  amountUSD?: Maybe<Scalars['Float']>
  needsComplete: Scalars['Boolean']
  feeTo?: Maybe<Scalars['String']>
  feeLiquidity?: Maybe<Scalars['Float']>
}

export type Swap = {
  __typename?: 'Swap'
  id: Scalars['ID']
  transaction: Transaction
  timestamp: Scalars['Int']
  pair: Pair
  sender: Scalars['String']
  amount0In: Scalars['Float']
  amount1In: Scalars['Float']
  amount0Out: Scalars['Float']
  amount1Out: Scalars['Float']
  to: Scalars['String']
  logIndex?: Maybe<Scalars['Int']>
  amountUSD: Scalars['Float']
}

export type Bundle = {
  __typename?: 'Bundle'
  id: Scalars['ID']
  ethPrice: Scalars['Float']
}

export type WhiteSwapDayData = {
  __typename?: 'WhiteSwapDayData'
  id: Scalars['ID']
  date: Scalars['Int']
  dailyVolumeETH: Scalars['Float']
  dailyVolumeUSD: Scalars['Float']
  dailyVolumeUntracked: Scalars['Float']
  totalVolumeETH: Scalars['Float']
  totalLiquidityETH: Scalars['Float']
  totalVolumeUSD: Scalars['Float']
  totalLiquidityUSD: Scalars['Float']
  txCount: Scalars['Int']
}

export type PairHourData = {
  __typename?: 'PairHourData'
  id: Scalars['ID']
  hourStartUnix: Scalars['Int']
  pair: Pair
  reserve0: Scalars['Float']
  reserve1: Scalars['Float']
  reserveUSD: Scalars['Float']
  hourlyVolumeToken0: Scalars['Float']
  hourlyVolumeToken1: Scalars['Float']
  hourlyVolumeUSD: Scalars['Float']
  hourlyTxns: Scalars['Int']
}

export type PairDayData = {
  __typename?: 'PairDayData'
  id: Scalars['ID']
  date: Scalars['Int']
  pairAddress: Scalars['String']
  token0: Token
  token1: Token
  reserve0: Scalars['Float']
  reserve1: Scalars['Float']
  totalSupply: Scalars['Float']
  reserveUSD: Scalars['Float']
  dailyVolumeUSD: Scalars['Float']
  dailyTxns: Scalars['Int']
}

export type TokenDayData = {
  __typename?: 'TokenDayData'
  id: Scalars['ID']
  date: Scalars['Int']
  token: Token
  dailyVolumeToken: Scalars['Float']
  dailyVolumeETH: Scalars['Float']
  dailyVolumeUSD: Scalars['Float']
  dailyTxns: Scalars['Int']
  totalLiquidityToken: Scalars['Float']
  totalLiquidityETH: Scalars['Float']
  totalLiquidityUSD: Scalars['Float']
  priceUSD: Scalars['Float']
}

export type TokensQuery = {
  tokens: Token[]
}

export type TokenDataQuery = {
  tokens: Token[]
  pairs0: { id: string }[]
  pairs1: { id: string }[]
}

export type GlobalTransactionsResponse = { transactions: Array<RawTransactions> }

export type GlobalChartTrxResponse = {
  whiteSwapDayDatas: Pick<WhiteSwapDayData, 'date' | 'totalLiquidityUSD' | 'dailyVolumeUSD'>[]
}

export type UserTransactionQueryVariables = Exact<{
  user: Scalars['String']
}>

export type TransactionQuery = {
  burns: Array<{
    amount0: string
    amount1: string
    amountUSD: string
    liquidity: string
    sender: string
    to: string
    pair: {
      token0: {
        symbol: string
        id: string
        __typename: 'Token'
      }
      token1: {
        symbol: string
        id: string
        __typename: 'Token'
      }
    }
    transaction: {
      id: string
      timestamp: string
      __typename: 'Transaction'
    }
    __typename: 'Burn'
  }>
  mints: Array<{
    amount0: string
    amount1: string
    amountUSD: string
    liquidity: string
    to: string
    pair: {
      token0: {
        id: string
        symbol: string
        __typename: 'Token'
      }
      token1: {
        id: string
        symbol: string
        __typename: 'Token'
      }
    }
    transaction: {
      id: string
      timestamp: string
      __typename: 'Transaction'
    }
    __typename: 'Mint'
  }>
  swaps: Array<{
    amount0In: string
    amount0Out: string
    amount1In: string
    amount1Out: string
    amountUSD: string
    to: string
    pair: {
      token0: {
        id: string
        symbol: string
        __typename: 'Token'
      }
      token1: {
        id: string
        symbol: string
        __typename: 'Token'
      }
    }
    transaction: {
      id: string
      timestamp: string
      __typename: 'Transaction'
    }
    __typename: 'Swap'
  }>
}

export type FilteredTransactionsQueryVariables = {
  allPairs: string[]
}

export type UserLiquidityPositionSnapshotsVariables = {
  skip: Scalars['Int']
  user: Scalars['String']
}

export type UserLiquidityPositionsVariables = {
  user: Scalars['String']
}

export type UserLiquidityPositionsQuery = {
  liquidityPositions: Array<{
    liquidityTokenBalance: string
    pair: {
      id: string
      reserve0: string
      reserve1: string
      reserveUSD: string
      token0: {
        id: string
        symbol: string
        derivedETH: string
        __typename: 'Token'
      }
      token1: {
        id: string
        symbol: string
        derivedETH: string
        __typename: 'Token'
      }
      totalSupply: string
      __typename: 'Pair'
    }
    __typename: 'LiquidityPosition'
  }>
}

export type TopLiquidityPositionVariables = {
  pair: Scalars['String']
}

export type TopLiquidityPositionQuery = {
  liquidityPositions: Array<{
    user: {
      id: string
      __typename: 'User'
    }
    pair: {
      id: string
      __typename: 'Pair'
    }
    liquidityTokenBalance: string
    __typename: 'LiquidityPosition'
  }>
}

export type PairChartItem = {
  date: Scalars['Int']
  dailyVolumeUSD: Scalars['Float']
  reserveUSD: Scalars['Float']
}

export type PairChartQuery = {
  pairDayDatas: Array<PairChartItem>
}
