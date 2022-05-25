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

export type RootQuery = {
  __typename?: 'RootQuery'
  countTransactions?: Maybe<Scalars['Int']>
  pair?: Maybe<Pair>
  pairs?: Maybe<Array<Maybe<Pair>>>
  token?: Maybe<Token>
  tokenPairs?: Maybe<Array<Scalars['String']>>
  tokens?: Maybe<Array<Maybe<Token>>>
  transactions?: Maybe<TransactionsCollection>
  trxPrice?: Maybe<Scalars['Float']>
  whiteSwapDayDatas?: Maybe<Array<WhiteSwapDayData>>
}

export type RootQueryPairArgs = {
  id: Scalars['String']
}

export type RootQueryTokenArgs = {
  id: Scalars['String']
}

export type RootQueryTokenPairsArgs = {
  id: Scalars['String']
}

export type RootQueryWhiteSwapDayDatasArgs = {
  startTime: Scalars['Int']
}

/** Pair */
export type Pair = {
  __typename?: 'Pair'
  /** Day Volume Usd */
  dayVolumeUSD: Scalars['Float']
  /** Pair address */
  id: Scalars['String']
  /** Liquidity Change Usd */
  liquidityChangeUSD: Scalars['Float']
  /** Token one */
  tokenOne: TokenPair
  /** Token two */
  tokenTwo: TokenPair
  /** Total Liquidity Usd */
  totalLiquidityUSD: Scalars['Float']
  /** Volume Change Usd */
  volumeChangeUSD: Scalars['Float']
  /** Week Volume Usd */
  weekVolumeUSD: Scalars['Float']
}

/** Crypto token */
export type TokenPair = {
  __typename?: 'TokenPair'
  /** Token derived Price */
  derivedPrice: Scalars['Float']
  /** Token address */
  id: Scalars['String']
  /** Token name */
  name: Scalars['String']
  /** Token price */
  price: Scalars['Float']
  /** Token reserve */
  reserve: Scalars['Float']
  /** Token symbol */
  symbol: Scalars['String']
}

/** Crypto token */
export type Token = {
  __typename?: 'Token'
  /** Token day Volume USD */
  dayVolumeUSD: Scalars['Float']
  /** Token address */
  id: Scalars['String']
  /** Token liquidity Change USD */
  liquidityChangeUSD: Scalars['Float']
  /** Token name */
  name: Scalars['String']
  /** Token one Day Txns */
  oneDayTxns: Scalars['Int']
  /** Token price Change USD */
  priceChangeUSD: Scalars['Float']
  /** Token price USD */
  priceUSD: Scalars['Float']
  /** Token symbol */
  symbol: Scalars['String']
  /** Token total Liquidity USD */
  totalLiquidityUSD: Scalars['Float']
  /** Token txn Change */
  txnChange: Scalars['Float']
  /** Token volume Change USD */
  volumeChangeUSD: Scalars['Float']
}

/** Transactions list */
export type TransactionsCollection = {
  __typename?: 'TransactionsCollection'
  /** Burns Transactions */
  burns?: Maybe<Array<Maybe<Transaction>>>
  /** Mints Transactions */
  mints?: Maybe<Array<Maybe<Transaction>>>
  /** Swaps Transactions */
  swaps?: Maybe<Array<Maybe<Transaction>>>
}

/** Transactions list */
export type TransactionsCollectionBurnsArgs = {
  limit: Scalars['Int']
  pairAddress?: InputMaybe<Scalars['String']>
  tokenAddress?: InputMaybe<Scalars['String']>
}

/** Transactions list */
export type TransactionsCollectionMintsArgs = {
  limit: Scalars['Int']
  pairAddress?: InputMaybe<Scalars['String']>
  tokenAddress?: InputMaybe<Scalars['String']>
}

/** Transactions list */
export type TransactionsCollectionSwapsArgs = {
  limit: Scalars['Int']
  pairAddress?: InputMaybe<Scalars['String']>
  tokenAddress?: InputMaybe<Scalars['String']>
}

/** Transaction */
export type Transaction = {
  __typename?: 'Transaction'
  /** Transaction account address */
  account: Scalars['String']
  /** Transaction hash */
  hash: Scalars['String']
  /** Transaction timestamp */
  timestamp: Scalars['Int']
  /** Token one */
  tokenOne: TokenTransaction
  /** Token two */
  tokenTwo: TokenTransaction
  /** Total Usd */
  totalUSD: Scalars['Float']
}

/** Crypto token */
export type TokenTransaction = {
  __typename?: 'TokenTransaction'
  /** Token amount */
  amount: Scalars['Float']
  /** Token address */
  id: Scalars['String']
  /** Token symbol */
  symbol: Scalars['String']
}

/** WhiteSwapDayData for Graph */
export type WhiteSwapDayData = {
  __typename?: 'WhiteSwapDayData'
  /** Data dailyVolumeUSD */
  dailyVolumeUSD: Scalars['Float']
  /** Data date */
  date: Scalars['Int']
  /** Data totalLiquidityUSD */
  totalLiquidityUSD: Scalars['Float']
}

export type GlobalChartQueryVariables = Exact<{
  startTime: Scalars['Int']
}>

export type GlobalChartQuery = {
  __typename?: 'RootQuery'
  whiteSwapDayDatas?: Array<{
    __typename?: 'WhiteSwapDayData'
    date: number
    dailyVolumeUSD: number
    totalLiquidityUSD: number
  }> | null
}

export type CurrentTrxPriceQueryVariables = Exact<{ [key: string]: never }>

export type CurrentTrxPriceQuery = { __typename?: 'RootQuery'; trxPrice?: number | null }

export type PairDataFragment = {
  __typename?: 'Pair'
  id: string
  totalLiquidityUSD: number
  dayVolumeUSD: number
  weekVolumeUSD: number
  liquidityChangeUSD: number
  volumeChangeUSD: number
  tokenOne: {
    __typename?: 'TokenPair'
    id: string
    name: string
    symbol: string
    reserve: number
    price: number
    derivedPrice: number
  }
  tokenTwo: {
    __typename?: 'TokenPair'
    id: string
    name: string
    symbol: string
    reserve: number
    price: number
    derivedPrice: number
  }
}

export type PairListQueryVariables = Exact<{ [key: string]: never }>

export type PairListQuery = {
  __typename?: 'RootQuery'
  pairs?: Array<{
    __typename?: 'Pair'
    id: string
    totalLiquidityUSD: number
    dayVolumeUSD: number
    weekVolumeUSD: number
    liquidityChangeUSD: number
    volumeChangeUSD: number
    tokenOne: {
      __typename?: 'TokenPair'
      id: string
      name: string
      symbol: string
      reserve: number
      price: number
      derivedPrice: number
    }
    tokenTwo: {
      __typename?: 'TokenPair'
      id: string
      name: string
      symbol: string
      reserve: number
      price: number
      derivedPrice: number
    }
  } | null> | null
}

export type PairQueryVariables = Exact<{
  address: Scalars['String']
}>

export type PairQuery = {
  __typename?: 'RootQuery'
  pair?: {
    __typename?: 'Pair'
    id: string
    totalLiquidityUSD: number
    dayVolumeUSD: number
    weekVolumeUSD: number
    liquidityChangeUSD: number
    volumeChangeUSD: number
    tokenOne: {
      __typename?: 'TokenPair'
      id: string
      name: string
      symbol: string
      reserve: number
      price: number
      derivedPrice: number
    }
    tokenTwo: {
      __typename?: 'TokenPair'
      id: string
      name: string
      symbol: string
      reserve: number
      price: number
      derivedPrice: number
    }
  } | null
}

export type TokensQueryVariables = Exact<{ [key: string]: never }>

export type TokensQuery = {
  __typename?: 'RootQuery'
  tokens?: Array<{
    __typename?: 'Token'
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
  } | null> | null
}

export type TokenQueryVariables = Exact<{
  address: Scalars['String']
}>

export type TokenQuery = {
  __typename?: 'RootQuery'
  token?: {
    __typename?: 'Token'
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
  } | null
}

export type TokenPairsQueryVariables = Exact<{
  tokenAddress: Scalars['String']
}>

export type TokenPairsQuery = { __typename?: 'RootQuery'; tokenPairs?: Array<string> | null }

export type TransactionDetailsFragment = {
  __typename?: 'Transaction'
  hash: string
  timestamp: number
  totalUSD: number
  account: string
  tokenOne: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
  tokenTwo: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
}

export type GlobalTransactionsQueryVariables = Exact<{ [key: string]: never }>

export type GlobalTransactionsQuery = {
  __typename?: 'RootQuery'
  transactions?: {
    __typename?: 'TransactionsCollection'
    mints?: Array<{
      __typename?: 'Transaction'
      hash: string
      timestamp: number
      totalUSD: number
      account: string
      tokenOne: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
      tokenTwo: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
    } | null> | null
    swaps?: Array<{
      __typename?: 'Transaction'
      hash: string
      timestamp: number
      totalUSD: number
      account: string
      tokenOne: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
      tokenTwo: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
    } | null> | null
    burns?: Array<{
      __typename?: 'Transaction'
      hash: string
      timestamp: number
      totalUSD: number
      account: string
      tokenOne: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
      tokenTwo: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
    } | null> | null
  } | null
}

export type TokenTransactionsQueryVariables = Exact<{
  tokenAddress: Scalars['String']
}>

export type TokenTransactionsQuery = {
  __typename?: 'RootQuery'
  transactions?: {
    __typename?: 'TransactionsCollection'
    mints?: Array<{
      __typename?: 'Transaction'
      hash: string
      timestamp: number
      totalUSD: number
      account: string
      tokenOne: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
      tokenTwo: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
    } | null> | null
    swaps?: Array<{
      __typename?: 'Transaction'
      hash: string
      timestamp: number
      totalUSD: number
      account: string
      tokenOne: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
      tokenTwo: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
    } | null> | null
    burns?: Array<{
      __typename?: 'Transaction'
      hash: string
      timestamp: number
      totalUSD: number
      account: string
      tokenOne: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
      tokenTwo: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
    } | null> | null
  } | null
}

export type PairTransactionsQueryVariables = Exact<{
  pairAddress: Scalars['String']
}>

export type PairTransactionsQuery = {
  __typename?: 'RootQuery'
  transactions?: {
    __typename?: 'TransactionsCollection'
    mints?: Array<{
      __typename?: 'Transaction'
      hash: string
      timestamp: number
      totalUSD: number
      account: string
      tokenOne: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
      tokenTwo: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
    } | null> | null
    swaps?: Array<{
      __typename?: 'Transaction'
      hash: string
      timestamp: number
      totalUSD: number
      account: string
      tokenOne: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
      tokenTwo: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
    } | null> | null
    burns?: Array<{
      __typename?: 'Transaction'
      hash: string
      timestamp: number
      totalUSD: number
      account: string
      tokenOne: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
      tokenTwo: { __typename?: 'TokenTransaction'; id: string; symbol: string; amount: number }
    } | null> | null
  } | null
}

export type TransactionCountQueryVariables = Exact<{ [key: string]: never }>

export type TransactionCountQuery = { __typename?: 'RootQuery'; countTransactions?: number | null }
