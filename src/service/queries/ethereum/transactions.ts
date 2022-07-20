import { gql } from 'apollo-boost'
import { MINT_DETAILS, BURN_DETAILS, SWAP_DETAILS } from 'service/fragments'

export const FILTERED_TRANSACTIONS = gql`
  ${MINT_DETAILS}
  ${BURN_DETAILS}
  ${SWAP_DETAILS}
  query FilteredTransactions($allPairs: [Bytes]!) {
    mints(first: 20, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
      ...MintDetails
    }
    burns(first: 20, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
      ...BurnDetails
    }
    swaps(first: 30, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
      ...SwapDetails
    }
  }
`

export const GLOBAL_TXNS = gql`
  ${MINT_DETAILS}
  ${BURN_DETAILS}
  ${SWAP_DETAILS}
  query GlobalTransactions {
    transactions(first: 100, orderBy: timestamp, orderDirection: desc) {
      mints(orderBy: timestamp, orderDirection: desc) {
        ...MintDetails
      }
      burns(orderBy: timestamp, orderDirection: desc) {
        ...BurnDetails
      }
      swaps(orderBy: timestamp, orderDirection: desc) {
        ...SwapDetails
      }
    }
  }
`

export const USER_TRANSACTIONS = gql`
  ${MINT_DETAILS}
  ${BURN_DETAILS}
  ${SWAP_DETAILS}
  query Transactions($user: Bytes!) {
    mints(orderBy: timestamp, orderDirection: desc, where: { to: $user }) {
      ...MintDetails
    }
    burns(orderBy: timestamp, orderDirection: desc, where: { sender: $user }) {
      ...BurnDetails
    }
    swaps(orderBy: timestamp, orderDirection: desc, where: { to: $user }) {
      ...SwapDetails
    }
  }
`

export const TRANSACTION_COUNT = gql`
  query TransactionCount($block: Block_height, $factoryAddress: String!) {
    whiteSwapFactories(block: $block, where: { id: $factoryAddress }) {
      txCount
    }
  }
`
