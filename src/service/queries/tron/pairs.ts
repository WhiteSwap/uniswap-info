import { gql } from 'apollo-boost'

const PAIR_DATA = gql`
  fragment PairData on Pair {
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
    fee
    volumeFeeChangeUSD
  }
`

export const PAIR_LIST = gql`
  ${PAIR_DATA}
  query PairList {
    pairs {
      ...PairData
    }
  }
`

export const PAIR = gql`
  ${PAIR_DATA}
  query Pair($address: String!) {
    pair(id: $address) {
      ...PairData
    }
  }
`
