import { Transaction as TronTransaction, TransactionDetailsFragment } from 'service/generated/graphql'
import { parseTokenInfo } from 'utils'

type TransactionsPayload = {
  mints?: Array<TransactionDetailsFragment | null> | null
  burns?: Array<TransactionDetailsFragment | null> | null
  swaps?: Array<TransactionDetailsFragment | null> | null
} | null

export function transactionMapper(type: TransactionType, payload?: TronTransaction | null): Transaction {
  return {
    hash: payload?.hash || '',
    timestamp: payload?.timestamp ? +payload.timestamp : 0,
    tokenOne: {
      id: payload?.tokenOne.id || '',
      symbol: parseTokenInfo('symbol', payload?.tokenOne.id, payload?.tokenOne.symbol),
      amount: payload?.tokenOne.amount ? +payload.tokenOne.amount : 0
    },
    tokenTwo: {
      id: payload?.tokenTwo.id || '',
      symbol: parseTokenInfo('symbol', payload?.tokenTwo.id, payload?.tokenTwo.symbol),
      amount: payload?.tokenTwo.amount ? +payload.tokenTwo.amount : 0
    },
    amountUSD: payload?.totalUSD ? +payload.totalUSD : 0,
    account: payload?.account || '',
    type
  }
}

export function transactionsMapper(payload?: TransactionsPayload): Transactions {
  return {
    mints: payload?.mints?.map(element => transactionMapper('mint', element)) || [],
    burns: payload?.burns?.map(element => transactionMapper('burn', element)) || [],
    swaps: payload?.swaps?.map(element => transactionMapper('swap', element)) || []
  }
}
