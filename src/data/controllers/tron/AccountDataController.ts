import { UserHistoryMock } from '__mocks__/account'
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
  AccountPositionChartQuery,
  AccountPositionChartQueryVariables,
  AccountPositionQuery,
  AccountPositionQueryVariables,
  TopLiquidityPositionsQuery
} from 'service/generated/tronGraphql'
import {
  ACCOUNT_LIQUIDITY_CHART,
  ACCOUNT_POSITIONS,
  ACCOUNT_POSITION_CHART,
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
    const { data } = await client.query<AccountPositionChartQuery, AccountPositionChartQueryVariables>({
      query: ACCOUNT_POSITION_CHART,
      variables: { accountAddress, startTime, pairAddress: pair.id }
    })
    return { [timeWindow]: positionChartMapper(data) }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserHistory(_account: string) {
    return UserHistoryMock
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
