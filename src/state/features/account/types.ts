export type PositionPairChartKey = 'fee' | 'liquidity'

export type AccountChartData = {
  date: number
  value: number
}

export type PositionChartData = Record<PositionPairChartKey, Record<string, AccountChartData[]>>
