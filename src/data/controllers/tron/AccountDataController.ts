import { IAccountDataController } from 'data/controllers/types/AccountController.interface'
import { TopLpsMock, UserHistoryMock, UserLiquidityChartMock, UserPositionsMock } from '__mocks__/account'

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getTopLps(_allPairs: any) {
    return TopLpsMock
  }
}
