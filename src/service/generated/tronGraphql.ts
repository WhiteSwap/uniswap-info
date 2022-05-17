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
  pairs?: Maybe<Array<Maybe<Pair>>>
  token?: Maybe<Token>
  tokens?: Maybe<Array<Maybe<Token>>>
  tokens_collection?: Maybe<TokenCollection>
  whiteSwapDayDatas?: Maybe<Array<WhiteSwapDayData>>
}

export type RootQueryTokenArgs = {
  id?: InputMaybe<Scalars['Int']>
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

/** Tokens list */
export type TokenCollection = {
  __typename?: 'TokenCollection'
  /** tokens list */
  tokens?: Maybe<Array<Maybe<Token>>>
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

export type TokenByAddressQueryVariables = Exact<{
  address: Scalars['Int']
}>

export type TokenByAddressQuery = {
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
