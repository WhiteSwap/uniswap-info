import { ITransactionDataController } from 'data/controllers/types/TransactionController.interface'
import { transactionsMapper } from 'data/mappers/tron/transactionMapper'
import { client } from 'service/client'
import {
  GlobalTransactionsQuery,
  PairTransactionsQuery,
  PairTransactionsQueryVariables,
  TokenTransactionsQuery,
  TokenTransactionsQueryVariables
} from 'service/generated/tronGraphql'
import { GLOBAL_TRANSACTIONS, PAIR_TRANSACTIONS, TOKEN_TRANSACTIONS } from 'service/queries/tron/transactions'
import { TransactionsMock } from '__mocks__/transactions'

export default class TransactionDataController implements ITransactionDataController {
  getDayTransactionCount(): Promise<number> {
    return Promise.resolve(0)
  }
  async getPairTransactions(pairAddress: string): Promise<Transactions> {
    const { data } = await client.query<PairTransactionsQuery, PairTransactionsQueryVariables>({
      query: PAIR_TRANSACTIONS,
      variables: { pairAddress }
    })
    return transactionsMapper(data)
  }
  async getTokenTransactions(tokenAddress: string) {
    const { data } = await client.query<TokenTransactionsQuery, TokenTransactionsQueryVariables>({
      query: TOKEN_TRANSACTIONS,
      variables: { tokenAddress }
    })
    return transactionsMapper(data)
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
