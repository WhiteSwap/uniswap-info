import { gql } from 'apollo-boost'

export const TOP_LIQUIDITY_POSITIONS = gql`
  query TopLiquidityPositions {
    topLiquidityPosition {
      account
      amount
      pair {
        id
        tokenOne {
          id
          symbol
          name
        }
        tokenTwo {
          id
          symbol
          name
        }
      }
    }
  }
`

export const ACCOUNT_POSITIONS = gql`
  query AccountPosition($accountAddress: String!) {
    account {
      positions(accountAddress: $accountAddress) {
        id
        pair
        tokenOneCode
        tokenOneAddress
        tokenOneAmount
        tokenTwoCode
        tokenTwoAddress
        tokenTwoAmount
        totalUsd
      }
    }
  }
`
