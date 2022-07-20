import { useActiveNetworkId } from 'state/features/application/selectors'
import { useAppSelector } from 'state/hooks'

export function useTokens() {
  const activeNetwork = useActiveNetworkId()
  return useAppSelector(state => state.token[activeNetwork])
}

export function useTokenPairs(pairIds: string[]) {
  const activeNetwork = useActiveNetworkId()
  return useAppSelector(state => {
    const pairs = state.pairs[activeNetwork]
    return Object.fromEntries(Object.entries(pairs).filter(([key]) => pairIds.includes(key)))
  })
}
