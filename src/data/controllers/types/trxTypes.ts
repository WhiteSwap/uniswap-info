import { Pair as TronPair } from 'service/generated/tronGraphql'

export type TronPosition = {
  pair: TronPair
  liquidityTokenBalance: number
  liquidityTokenTotalSupply: number
  feeEarned: number
  __typename: string
}
