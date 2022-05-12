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

/** Crypto token */
export type Token = {
  __typename?: 'Token'
  /** Token derived TRX */
  derivedTRX: Scalars['Float']
  /** Token address */
  id: Scalars['String']
  /** Token liquidity Change USD */
  liquidityChangeUSD: Scalars['Int']
  /** Token name */
  name: Scalars['String']
  /** Token one Day Txns */
  oneDayTxns: Scalars['Int']
  /** Token price Change USD */
  priceChangeUSD: Scalars['Int']
  /** Token price USD */
  priceUSD: Scalars['Float']
  /** Token symbol */
  symbol: Scalars['String']
  /** Token total Liquidity USD */
  totalLiquidityUSD: Scalars['Float']
  /** Token trade Volume USD */
  tradeVolumeUSD: Scalars['Float']
  /** Token txn Change */
  txnChange: Scalars['Int']
  /** Token volume Change USD */
  volumeChangeUSD: Scalars['Int']
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
