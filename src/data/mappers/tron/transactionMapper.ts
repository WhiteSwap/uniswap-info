import { Transaction as TronTransaction, GlobalTransactionsQuery } from 'service/generated/tronGraphql'
import { parseTokenInfo } from 'utils'

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

export function transactionsMapper(payload: GlobalTransactionsQuery): Transactions {
  return {
    mints: payload?.transactions?.mints?.map(el => transactionMapper('mint', el)) || [],
    burns: payload.transactions?.burns?.map(el => transactionMapper('burn', el)) || [],
    swaps: payload.transactions?.swaps?.map(el => transactionMapper('swap', el)) || []
  }
}
