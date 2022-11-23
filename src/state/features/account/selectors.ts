import { useActiveNetworkId } from 'state/features/application/selectors'
import { useAppSelector } from 'state/hooks'

export function useTopLiquidityPositionList() {
  const activeNetwork = useActiveNetworkId()
  return useAppSelector(state => state.account[activeNetwork].topLiquidityPositions)
}

export function useAccountTransactions(account: string) {
  const activeNetwork = useActiveNetworkId()
  return useAppSelector(state => state.account[activeNetwork].byAddress?.[account]?.transactions)
}

export function useAccountLiquiditySnapshots(account: string) {
  const activeNetwork = useActiveNetworkId()
  return useAppSelector(state => state.account[activeNetwork].byAddress?.[account]?.liquiditySnapshots)
}

export function useAccountPairReturns(account: string, pairAddress: string) {
  const activeNetwork = useActiveNetworkId()
  return useAppSelector(state => state.account[activeNetwork].byAddress?.[account]?.pairReturns?.[pairAddress])
}
