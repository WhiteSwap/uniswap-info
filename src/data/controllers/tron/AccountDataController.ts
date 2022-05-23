import { IAccountDataController } from 'data/controllers/types/AccountController.interface'
import {
  liquiditySnapshotListMapper,
  userPositionListMapper,
  liquidityPositionListMapper
} from 'data/mappers/tron/accountMapper'
import { TopLpsMock, UserHistoryMock, UserLiquidityChartMock, UserPositionsMock } from '__mocks__/account'

export default class AccountDataController implements IAccountDataController {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserHistory(_account: string) {
    return Promise.resolve(liquiditySnapshotListMapper(UserHistoryMock))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserLiquidityChart(_startDateTimestamp: number, _history: LiquiditySnapshot[]) {
    return Promise.resolve(UserLiquidityChartMock)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserPositions(_account: string, _price: number, _snapshots: LiquiditySnapshot[]) {
    // @ts-ignore
    return Promise.resolve(userPositionListMapper(UserPositionsMock))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getTopLps(_allPairs: any) {
    return Promise.resolve(liquidityPositionListMapper(TopLpsMock))
  }
}
