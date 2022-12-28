import { UserHistoryMock, UserLiquidityChartMock, UserPositionsMock } from '__mocks__/account'
import { IAccountDataController } from 'data/controllers/types/AccountController.interface'
import { liquidityPositionsMapper } from 'data/mappers/tron/accountMappers'
import { client } from 'service/client'
import { TopLiquidityPositionsQuery } from 'service/generated/tronGraphql'
import { TOP_LIQUIDITY_POSITIONS } from 'service/queries/tron/account'

export default class AccountDataController implements IAccountDataController {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserHistory(_account: string) {
    return UserHistoryMock
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserLiquidityChart(_startDateTimestamp: number, _history: LiquiditySnapshot[]) {
    return UserLiquidityChartMock
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserPositions(_account: string, _price: number, _snapshots: LiquiditySnapshot[]) {
    // @ts-ignore
    return UserPositionsMock
  }

  async getTopLps() {
    const { data } = await client.query<TopLiquidityPositionsQuery>({
      query: TOP_LIQUIDITY_POSITIONS
    })
    return liquidityPositionsMapper(data)
  }
}
