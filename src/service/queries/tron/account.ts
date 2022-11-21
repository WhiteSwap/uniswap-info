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
