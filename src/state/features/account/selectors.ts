import { useActiveNetworkId } from 'state/features/application/selectors'
import { useAppSelector } from 'state/hooks'

export function useAccountLiquiditySnapshots(account: string) {
  const activeNetwork = useActiveNetworkId()
  return useAppSelector(state => state.account[activeNetwork][account]?.liquiditySnapshots)
}
