import { IAccountDataController } from 'data/controllers/types/AccountController.interface'
import {
  liquidityPositionsMapper,
  positionsMapper,
  liquidityChartMapper,
  positionLiquidityChartMapper,
  positionFeeChartMapper
} from 'data/mappers/accountMappers'
import { client } from 'service/client'
import {
  AccountLiquidityDataQuery,
  AccountLiquidityDataQueryVariables,
  AccountPositionQuery,
  AccountPositionQueryVariables,
  PositionFeeChartDataQuery,
  PositionLiquidityChartDataQuery,
  PositionLiquidityChartDataQueryVariables,
  TopLiquidityPositionsQuery
} from 'service/generated/graphql'
import {
  ACCOUNT_LIQUIDITY_CHART,
  ACCOUNT_POSITIONS,
  POSITION_FEE_CHART_DATA,
  POSITION_LIQUIDITY_CHART_DATA,
  TOP_LIQUIDITY_POSITIONS
} from 'service/queries/account'
import { PositionChartData, PositionChartView } from 'state/features/account/types'
import { PairDetails } from 'state/features/pairs/types'
import { getTimeframe } from 'utils'

export default class AccountDataController implements IAccountDataController {
  async getUserHistory() {
    // FIXME: return empty array, because TRON doesn't return user history. It's necessary only for ETH chain
    return []
  }

  async getPositionChart(
    accountAddress: string,
    pair: PairDetails,
    timeWindow: string,
    key: PositionChartView
  ): Promise<Partial<PositionChartData>> {
    // FIXME: not the best solution. This chart loading realization depends on ethereum position chart data
    // Need to load fee & liquidity chart data in one controller
    const startTime = getTimeframe(timeWindow)
    if (key === 'liquidity') {
      const { data } = await client.query<PositionLiquidityChartDataQuery, PositionLiquidityChartDataQueryVariables>({
        query: POSITION_LIQUIDITY_CHART_DATA,
        variables: { accountAddress, startTime, pairAddress: pair.id }
      })
      return { [key]: { [timeWindow]: positionLiquidityChartMapper(data) } }
    } else {
      const { data } = await client.query<PositionFeeChartDataQuery, PositionLiquidityChartDataQueryVariables>({
        query: POSITION_FEE_CHART_DATA,
        variables: { accountAddress, startTime, pairAddress: pair.id }
      })
      return { [key]: { [timeWindow]: positionFeeChartMapper(data) } }
    }
  }

  async getUserLiquidityChart(account: string, timeWindow: string) {
    const startTime = getTimeframe(timeWindow)
    const { data } = await client.query<AccountLiquidityDataQuery, AccountLiquidityDataQueryVariables>({
      query: ACCOUNT_LIQUIDITY_CHART,
      variables: { accountAddress: account, startTime }
    })
    return { [timeWindow]: liquidityChartMapper(data) }
  }

  async getUserPositions(account: string) {
    const { data } = await client.query<AccountPositionQuery, AccountPositionQueryVariables>({
      query: ACCOUNT_POSITIONS,
      variables: { accountAddress: account },
      fetchPolicy: 'no-cache'
    })
    return positionsMapper(data)
  }

  async getTopLps() {
    const { data } = await client.query<TopLiquidityPositionsQuery>({
      query: TOP_LIQUIDITY_POSITIONS
    })
    return liquidityPositionsMapper(data)
  }
}
