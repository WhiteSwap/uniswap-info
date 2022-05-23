import { Pair as TronPair } from 'service/generated/tronGraphql'

export type TronPosition = {
  pair: TronPair
  liquidityTokenBalance: string
  feeEarned: number
  __typename: string
}
