import { gql } from 'apollo-boost'

export const TOKENS = gql`
  query Tokens {
    tokens {
      id
      name
      symbol
      derivedTRX
      tradeVolumeUSD
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

export const TOKEN_BY_ADDRESS = gql`
  query TokenByAddress($address: Int!) {
    token(id: $address) {
      id
      name
      symbol
      derivedTRX
      tradeVolumeUSD
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
