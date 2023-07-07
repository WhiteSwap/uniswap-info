import { ITransactionDataController } from 'data/controllers/types/TransactionController.interface'
import { transactionsMapper } from 'data/mappers/transactionMapper'
import { client } from 'service/client'
import {
  AccountTransactionsQuery,
  AccountTransactionsQueryVariables,
  GlobalTransactionsQuery,
  PairTransactionsQuery,
  PairTransactionsQueryVariables,
  TokenTransactionsQuery,
  TokenTransactionsQueryVariables,
  TransactionCountQuery
} from 'service/generated/graphql'
import {
  ACCOUNT_TRANSACTIONS,
  GLOBAL_TRANSACTIONS,
  PAIR_TRANSACTIONS,
  TOKEN_TRANSACTIONS,
  TRANSACTION_COUNT
} from 'service/queries/transactions'

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
    return transactionsMapper(data.transactions)
  }
  async getTokenTransactions(tokenAddress: string) {
    const { data } = await client.query<TokenTransactionsQuery, TokenTransactionsQueryVariables>({
      query: TOKEN_TRANSACTIONS,
      variables: { tokenAddress },
      fetchPolicy: 'no-cache'
    })
    return transactionsMapper(data.transactions)
  }
  async getUserTransactions(account: string) {
    const { data } = await client.query<AccountTransactionsQuery, AccountTransactionsQueryVariables>({
      query: ACCOUNT_TRANSACTIONS,
      variables: { accountAddress: account },
      fetchPolicy: 'no-cache'
    })
    return transactionsMapper(data.account)
  }
  async getAllTransactions() {
    const { data } = await client.query<GlobalTransactionsQuery>({
      query: GLOBAL_TRANSACTIONS,
      fetchPolicy: 'no-cache'
    })
    return transactionsMapper(data.transactions)
  }
}
