import { gql } from 'apollo-boost'

export const GLOBAL_CHART = gql`
  query GlobalChart($startTime: Int!) {
    whiteSwapDayDatas(startTime: $startTime) {
      date
      dailyVolumeUSD
      totalLiquidityUSD
    }
  }
`

export const NATIVE_TOKEN_PRICE = gql`
  query CurrentTrxPrice {
    nativeTokenPrice
  }
`

export const LAST_BLOCK = gql`
  query LastBlock {
    lastBlock
  }
`
