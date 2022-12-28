import { IAccountDataController } from 'data/controllers/types/AccountController.interface'
import {
  liquidityPositionsMapper,
  positionsMapper,
  liquidityChartMapper,
  positionChartMapper
} from 'data/mappers/tron/accountMappers'
import { client } from 'service/client'
import {
  AccountLiquidityDataQuery,
  AccountLiquidityDataQueryVariables,
  AccountPositionQuery,
  AccountPositionQueryVariables,
  PositionLiquidityChartDataQuery,
  PositionLiquidityChartDataQueryVariables,
  TopLiquidityPositionsQuery
} from 'service/generated/tronGraphql'
import {
  ACCOUNT_LIQUIDITY_CHART,
  ACCOUNT_POSITIONS,
  POSITION_LIQUIDITY_CHART_DATA,
  TOP_LIQUIDITY_POSITIONS
} from 'service/queries/tron/account'
import { PairDetails } from 'state/features/pairs/types'
import { getTimeframe } from 'utils'

export default class AccountDataController implements IAccountDataController {
  async getPositionChart(
    accountAddress: string,
    pair: PairDetails,
    timeWindow: string
  ): Promise<Record<string, PairReturn[]>> {
    const startTime = getTimeframe(timeWindow)
    const { data } = await client.query<PositionLiquidityChartDataQuery, PositionLiquidityChartDataQueryVariables>({
      query: POSITION_LIQUIDITY_CHART_DATA,
      variables: { accountAddress, startTime, pairAddress: pair.id }
    })
    return { [timeWindow]: positionChartMapper(data) }
  }
  async getUserHistory() {
    // FIXME: return empty array, because TRON doesn't return user history. It's necessary only for ETH chain
    return []
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
      variables: { accountAddress: account }
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
