import { HealthStatus } from 'state/features/application/types'

export interface IGlobalDataController {
  /**
   * Get historical data for volume and liquidity used in global charts
   * on main page
   * @param {*} oldestDateToFetch // start of window to fetch from
   */
  getChartData(oldestDateToFetch: number): Promise<ChartDailyItem[]>
  /**
   * Gets the current price  of ETH, 24 hour price, and % change between them
   */
  getPrice(): Promise<number[]>
  getHealthStatus(): Promise<HealthStatus>
}
