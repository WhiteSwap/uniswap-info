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
    }
  }
`

export const TOKEN_PAIRS = gql`
  query TokenPairs($tokenAddress: String!) {
    tokenPairs(id: $tokenAddress)
  }
`
