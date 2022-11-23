import { UserHistoryMock, UserLiquidityChartMock } from '__mocks__/account'
import { IAccountDataController } from 'data/controllers/types/AccountController.interface'
import { liquidityPositionsMapper, positionsMapper } from 'data/mappers/tron/accountMappers'
import { client } from 'service/client'
import {
  AccountPositionQuery,
  AccountPositionQueryVariables,
  TopLiquidityPositionsQuery
} from 'service/generated/tronGraphql'
import { ACCOUNT_POSITIONS, TOP_LIQUIDITY_POSITIONS } from 'service/queries/tron/account'

export default class AccountDataController implements IAccountDataController {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserHistory(_account: string) {
    return UserHistoryMock
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserLiquidityChart(_startDateTimestamp: number, _history: LiquiditySnapshot[]) {
    return UserLiquidityChartMock
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
