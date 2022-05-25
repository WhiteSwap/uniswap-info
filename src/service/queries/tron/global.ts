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

export const CURRENT_TRX_PRICE = gql`
  query CurrentTrxPrice {
    trxPrice
  }
`
