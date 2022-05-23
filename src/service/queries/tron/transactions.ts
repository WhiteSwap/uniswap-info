import { gql } from 'apollo-boost'

const TRANSACTION_DETAILS = gql`
  fragment TransactionDetails on Transaction {
    hash
    timestamp
    tokenOne {
      id
      symbol
      amount
    }
    tokenTwo {
      id
      symbol
      amount
    }
    totalUSD
    account
  }
`

export const GLOBAL_TRANSACTIONS = gql`
  ${TRANSACTION_DETAILS}
  query GlobalTransactions {
    transactions {
      mints(limit: 30) {
        ...TransactionDetails
      }
      swaps(limit: 30) {
        ...TransactionDetails
      }
      burns(limit: 30) {
        ...TransactionDetails
      }
    }
  }
`
