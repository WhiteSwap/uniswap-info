import { TopLiquidityPositionsQuery } from 'service/generated/tronGraphql'
import { parseTokenInfo } from 'utils'

export function liquidityPositionsMapper(payload: TopLiquidityPositionsQuery): LiquidityPosition[] {
  return (
    payload?.topLiquidityPosition?.map(element => ({
      amount: element?.amount ? +element.amount : 0,
      account: element?.account || '',
      pair: {
        id: element?.pair?.id || '',
        tokenOne: {
          id: element?.pair?.tokenOne?.id || '',
          symbol: parseTokenInfo('symbol', element?.pair?.tokenOne?.id, element?.pair?.tokenOne?.symbol)
        },
        tokenTwo: {
          id: element?.pair?.tokenTwo?.id || '',
          symbol: parseTokenInfo('symbol', element?.pair?.tokenTwo?.id, element?.pair?.tokenTwo?.symbol)
        }
      }
    })) || []
  )
}
