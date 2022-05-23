import { ITransactionDataController } from 'data/controllers/types/TransactionController.interface'
import { TransactionsMock } from '__mocks__/transactions'

export default class TransactionDataController implements ITransactionDataController {
  getDayTransactionCount(): Promise<number> {
    return Promise.resolve(0)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getTransactions(_allPairs: string[]) {
    return Promise.resolve(TransactionsMock)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserTransactions(_account: string) {
    return Promise.resolve(TransactionsMock)
  }
  async getAllTransactions() {
    return Promise.resolve(TransactionsMock)
  }
}
