import { gql } from 'apollo-boost'

export const TOKENS = gql`
  query Tokens {
    tokens {
      id
      name
      symbol
      dayVolumeUSD
      totalLiquidityUSD
      priceUSD
      liquidityChangeUSD
      volumeChangeUSD
      priceChangeUSD
      oneDayTxns
      txnChange
      isFullActive
      isTokenList
    }
  }
`

export const TOKEN = gql`
  query Token($address: String!) {
    token(id: $address) {
      id
      name
      symbol
      dayVolumeUSD
      totalLiquidityUSD
      priceUSD
      liquidityChangeUSD
      volumeChangeUSD
      priceChangeUSD
      oneDayTxns
      txnChange
      isFullActive
      isTokenList
    }
  }
`

export const TOKEN_DAILY_DATA = gql`
  query TokenDailyData($startTime: Int!, $id: String!) {
    tokenDailyData(startTime: $startTime, id: $id) {
      date
      volume
      liquidity
    }
  }
`

export const TOKEN_PAIRS = gql`
  query TokenPairs($tokenAddress: String!) {
    tokenPairs(id: $tokenAddress)
  }
`

export const TOKEN_HOURLY_PRICE = gql`
  query TokenHourlyPrice($startTime: Int!, $id: String!) {
    tokenHourlyPrice(startTime: $startTime, id: $id) {
      timestamp
      open
      close
    }
  }
`

export const TOKEN_DAILY_PRICE = gql`
  query TokenDailyPrice($startTime: Int!, $id: String!) {
    tokenDailyPrice(startTime: $startTime, id: $id) {
      timestamp
      open
      close
    }
  }
`
