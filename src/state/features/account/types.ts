export type PositionChartKey = 'fee' | 'liquidity'

export type AccountChartData = {
  date: number
  value: number
}

export type PositionChartData = Record<PositionChartKey, Record<string, AccountChartData[]>>
