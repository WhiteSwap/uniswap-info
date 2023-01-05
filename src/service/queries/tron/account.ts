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
        earningFeeTokenOneAmount
        earningFeeTokenTwoAmount
        earningFeeTotalUsd
      }
    }
  }
`

export const ACCOUNT_LIQUIDITY_CHART = gql`
  query AccountLiquidityData($accountAddress: String!, $startTime: Int!) {
    account {
      liquidityData(accountAddress: $accountAddress, startTime: $startTime) {
        timestamp
        totalLiquidityUSD
      }
    }
  }
`

export const POSITION_LIQUIDITY_CHART_DATA = gql`
  query PositionLiquidityChartData($accountAddress: String!, $pairAddress: String!, $startTime: Int!) {
    account {
      liquidityPairData(accountAddress: $accountAddress, pairAddress: $pairAddress, startTime: $startTime) {
        timestamp
        totalLiquidityUSD
      }
    }
  }
`

export const POSITION_FEE_CHART_DATA = gql`
  query PositionFeeChartData($accountAddress: String!, $pairAddress: String!, $startTime: Int!) {
    account {
      earningFeePairData(accountAddress: $accountAddress, pairAddress: $pairAddress, startTime: $startTime) {
        timestamp
        totalEarningFeeUSD
      }
    }
  }
`
