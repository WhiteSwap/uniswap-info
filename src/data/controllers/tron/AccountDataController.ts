import { UserHistoryMock } from '__mocks__/account'
import { IAccountDataController } from 'data/controllers/types/AccountController.interface'
import { liquidityChartMapper, liquidityPositionsMapper, positionsMapper } from 'data/mappers/tron/accountMappers'
import { client } from 'service/client'
import {
  AccountLiquidityDataQuery,
  AccountLiquidityDataQueryVariables,
  AccountPositionQuery,
  AccountPositionQueryVariables,
  TopLiquidityPositionsQuery
} from 'service/generated/tronGraphql'
import { ACCOUNT_LIQUIDITY_CHART, ACCOUNT_POSITIONS, TOP_LIQUIDITY_POSITIONS } from 'service/queries/tron/account'
import { getTimeframe } from 'utils'

export default class AccountDataController implements IAccountDataController {
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
