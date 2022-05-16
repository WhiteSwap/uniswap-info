import { gql } from 'apollo-boost'

export const PAIR_LIST = gql`
  query PairList {
    pairs {
      id
      tokenOne {
        id
        name
        symbol
        reserve
        price
        derivedPrice
      }
      tokenTwo {
        id
        name
        symbol
        reserve
        price
        derivedPrice
      }
      totalLiquidityUSD
      dayVolumeUSD
      weekVolumeUSD
      liquidityChangeUSD
      volumeChangeUSD
    }
  }
`
