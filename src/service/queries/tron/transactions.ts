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

export const TOKEN_TRANSACTIONS = gql`
  ${TRANSACTION_DETAILS}
  query TokenTransactions($tokenAddress: String!) {
    transactions {
      mints(tokenAddress: $tokenAddress, limit: 30) {
        ...TransactionDetails
      }
      swaps(tokenAddress: $tokenAddress, limit: 30) {
        ...TransactionDetails
      }
      burns(tokenAddress: $tokenAddress, limit: 30) {
        ...TransactionDetails
      }
    }
  }
`

export const PAIR_TRANSACTIONS = gql`
  ${TRANSACTION_DETAILS}
  query PairTransactions($pairAddress: String!) {
    transactions {
      mints(pairAddress: $pairAddress, limit: 30) {
        ...TransactionDetails
      }
      swaps(pairAddress: $pairAddress, limit: 30) {
        ...TransactionDetails
      }
      burns(pairAddress: $pairAddress, limit: 30) {
        ...TransactionDetails
      }
    }
  }
`

export const ACCOUNT_TRANSACTIONS = gql`
  ${TRANSACTION_DETAILS}
  query AccountTransactions($accountAddress: String!) {
    account {
      mints(limit: 30, accountAddress: $accountAddress) {
        ...TransactionDetails
      }
      swaps(limit: 30, accountAddress: $accountAddress) {
        ...TransactionDetails
      }
      burns(limit: 30, accountAddress: $accountAddress) {
        ...TransactionDetails
      }
    }
  }
`

export const TRANSACTION_COUNT = gql`
  query TransactionCount {
    countTransactions
  }
`
