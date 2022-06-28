import { ITransactionDataController } from 'data/controllers/types/TransactionController.interface'
import { client } from 'service/client'
import {
  FILTERED_TRANSACTIONS,
  GLOBAL_TXNS,
  TRANSACTION_COUNT,
  USER_TRANSACTIONS
} from 'service/queries/ethereum/transactions'
import {
  FilteredTransactionsQueryVariables,
  GlobalTransactionsResponse,
  TransactionQuery,
  UserTransactionQueryVariables
} from 'service/generated/ethereumGraphql'
import { transactionsMapper } from 'data/mappers/ethereum/transactionMapper'
import { FACTORY_ADDRESS } from 'constants/index'
import dayjs from 'dayjs'
import { getBlocksFromTimestamps } from 'utils'

async function fetchTransactionCountByBlock(block?: number) {
  return client.query({
    query: TRANSACTION_COUNT,
    variables: {
      block: block ? { number: block } : null,
      factoryAddress: FACTORY_ADDRESS
    }
  })
}

export default class TransactionDataController implements ITransactionDataController {
  async getDayTransactionCount(): Promise<number> {
    try {
      // get timestamps for the days
      const utcCurrentTime = dayjs()
      const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()

      // get the blocks needed for time travel queries
      const [oneDayBlock] = await getBlocksFromTimestamps([utcOneDayBack])

      // fetch the txn count for current day
      const result = await fetchTransactionCountByBlock()
      const currentData = result.data.whiteSwapFactories[0]

      // fetch the txn count for previous day
      const oneDayResult = await fetchTransactionCountByBlock(oneDayBlock?.number)
      const previousData = oneDayResult.data.whiteSwapFactories[0]

      if (currentData && previousData) {
        return Number.parseFloat(currentData.txCount) - Number.parseFloat(previousData?.txCount || '0')
      }
    } catch (error) {
      console.log(error)
    }

    return 0
  }
  async getPairTransactions(pairAddress: string): Promise<Transactions> {
    const result = await client.query<TransactionQuery, FilteredTransactionsQueryVariables>({
      query: FILTERED_TRANSACTIONS,
      variables: {
        allPairs: [pairAddress]
      }
    })
    return transactionsMapper(result.data)
  }
  async getTokenTransactions(_: string, tokenAddress: string[]): Promise<Transactions> {
    const result = await client.query<TransactionQuery, FilteredTransactionsQueryVariables>({
      query: FILTERED_TRANSACTIONS,
      variables: {
        allPairs: tokenAddress
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
      (accumulator, current) => {
        return {
          mints: [...accumulator.mints, ...current.mints],
          swaps: [...accumulator.swaps, ...current.swaps],
          burns: [...accumulator.burns, ...current.burns]
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
