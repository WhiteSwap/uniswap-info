import { ITransactionDataController } from 'data/controllers/types/TransactionController.interface'
import { transactionsMapper } from 'data/mappers/tron/transactionMapper'
import { client } from 'service/client'
import { GlobalTransactionsQuery } from 'service/generated/tronGraphql'
import { GLOBAL_TRANSACTIONS } from 'service/queries/tron/transactions'
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
    const { data } = await client.query<GlobalTransactionsQuery>({ query: GLOBAL_TRANSACTIONS })
    return transactionsMapper(data)
  }
}
