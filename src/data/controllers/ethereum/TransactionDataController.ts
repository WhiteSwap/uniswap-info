import { ITransactionDataController } from 'data/controllers/types/TransactionController.interface'
import { client } from 'service/client'
import { FILTERED_TRANSACTIONS, GLOBAL_TXNS, USER_TRANSACTIONS } from 'service/queries/ethereum/transactions'
import {
  FilteredTransactionsQueryVariables,
  GlobalTransactionsResponse,
  TransactionQuery,
  UserTransactionQueryVariables
} from 'service/generated/ethereumGraphql'
import { transactionsMapper } from 'data/mappers/ethereum/transactionMapper'

export default class TransactionDataController implements ITransactionDataController {
  async getTransactions(allPairs: string[]) {
    const result = await client.query<TransactionQuery, FilteredTransactionsQueryVariables>({
      query: FILTERED_TRANSACTIONS,
      variables: {
        allPairs
      }
    })
    return transactionsMapper(result.data)
  }
  async getUserTransactions(account: string) {
    const result = await client.query<TransactionQuery, UserTransactionQueryVariables>({
      query: USER_TRANSACTIONS,
      variables: {
        user: account
      },
      fetchPolicy: 'no-cache'
    })
    return transactionsMapper(result.data)
  }
  async getAllTransactions() {
    const result = await client.query<GlobalTransactionsResponse>({
      query: GLOBAL_TXNS
    })

    const allTransactions = result.data.transactions.reduce<RawTransactions>(
      (acc, cur) => {
        return {
          mints: acc.mints.concat(cur.mints),
          swaps: acc.swaps.concat(cur.swaps),
          burns: acc.burns.concat(cur.burns)
        }
      },
      {
        mints: [],
        swaps: [],
        burns: []
      }
    )
    return transactionsMapper(allTransactions)
  }
}
