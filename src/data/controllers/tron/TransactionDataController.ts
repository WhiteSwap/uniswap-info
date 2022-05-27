import { ITransactionDataController } from 'data/controllers/types/TransactionController.interface'
import { transactionsMapper } from 'data/mappers/tron/transactionMapper'
import { client } from 'service/client'
import {
  GlobalTransactionsQuery,
  PairTransactionsQuery,
  PairTransactionsQueryVariables,
  TokenTransactionsQuery,
  TokenTransactionsQueryVariables,
  TransactionCountQuery
} from 'service/generated/tronGraphql'
import {
  GLOBAL_TRANSACTIONS,
  PAIR_TRANSACTIONS,
  TOKEN_TRANSACTIONS,
  TRANSACTION_COUNT
} from 'service/queries/tron/transactions'
import { TransactionsMock } from '__mocks__/transactions'

export default class TransactionDataController implements ITransactionDataController {
  async getDayTransactionCount() {
    const { data } = await client.query<TransactionCountQuery>({ query: TRANSACTION_COUNT, fetchPolicy: 'no-cache' })
    return data.countTransactions || 0
  }
  async getPairTransactions(pairAddress: string): Promise<Transactions> {
    const { data } = await client.query<PairTransactionsQuery, PairTransactionsQueryVariables>({
      query: PAIR_TRANSACTIONS,
      variables: { pairAddress },
      fetchPolicy: 'no-cache'
    })
    return transactionsMapper(data)
  }
  async getTokenTransactions(tokenAddress: string) {
    const { data } = await client.query<TokenTransactionsQuery, TokenTransactionsQueryVariables>({
      query: TOKEN_TRANSACTIONS,
      variables: { tokenAddress },
      fetchPolicy: 'no-cache'
    })
    return transactionsMapper(data)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserTransactions(_account: string) {
    return Promise.resolve(TransactionsMock)
  }
  async getAllTransactions() {
    const { data } = await client.query<GlobalTransactionsQuery>({
      query: GLOBAL_TRANSACTIONS,
      fetchPolicy: 'no-cache'
    })
    return transactionsMapper(data)
  }
}
