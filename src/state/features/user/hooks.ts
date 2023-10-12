import { useActiveNetworkId } from 'state/features/application/selectors'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { removeAccount, addAccount, setDarkMode, addPair, removePair, addToken, removeToken } from './slice'
import { SavedPair, SavedToken } from './types'

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch()
  const isDarkMode = useAppSelector(state => state.user.darkMode)
  const toggleDarkMode = () => {
    dispatch(setDarkMode(!isDarkMode))
  }
  return [isDarkMode, toggleDarkMode]
}

export function useSavedAccounts(): [string[], (account: string) => void, (account: string) => void] {
  const activeNetwork = useActiveNetworkId()
  const dispatch = useAppDispatch()
  const savedAccounts = useAppSelector(state => state.user[activeNetwork]?.savedAccounts)

  const addSavedAccount = (account: string) => {
    dispatch(addAccount({ id: account, networkId: activeNetwork }))
  }

  const removeSavedAccount = (account: string) => {
    dispatch(removeAccount({ id: account, networkId: activeNetwork }))
  }

  return [savedAccounts, addSavedAccount, removeSavedAccount]
}

export function useToggleSavedAccount(account?: string): [boolean, () => void] {
  const [savedAccounts, addAccount, removeAccount] = useSavedAccounts()
  const isSaved = savedAccounts?.includes(account || '')

  const toggleSavedAccount = () => {
    if (account) {
      if (isSaved) {
        removeAccount(account)
      } else {
        addAccount(account)
      }
    }
  }

  return [isSaved, toggleSavedAccount]
}

export function useSavedPairs(): [
  Record<string, SavedPair>,
  (address: string, token0Address: string, token1Address: string, token0Symbol: string, token1Symbol: string) => void,
  (address: string) => void
] {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const savedPairs = useAppSelector(state => state.user[activeNetwork]?.savedPairs)

  const addSavedPair = (
    address: string,
    token0Address: string,
    token1Address: string,
    token0Symbol: string,
    token1Symbol: string
  ) => {
    dispatch(
      addPair({
        pair: {
          address,
          token0Address,
          token1Address,
          token0Symbol,
          token1Symbol
        },
        networkId: activeNetwork
      })
    )
  }

  const removeSavedPair = (address: string) => {
    dispatch(removePair({ id: address, networkId: activeNetwork }))
  }

  return [savedPairs, addSavedPair, removeSavedPair]
}

export function useToggleSavedPair(
  address?: string,
  token0Address?: string,
  token1Address?: string,
  token0Symbol?: string,
  token1Symbol?: string
): [boolean, () => void] {
  const [savedPairs, addSavedPair, removeSavedPair] = useSavedPairs()
  const isSaved = address && typeof savedPairs === 'object' && savedPairs[address] ? true : false

  const toggleSavedPair = () => {
    if (address) {
      if (isSaved) {
        removeSavedPair(address)
      } else {
        if (token0Address && token1Address && token0Symbol && token1Symbol) {
          addSavedPair(address, token0Address, token1Address, token0Symbol, token1Symbol)
        }
      }
    }
  }

  return [isSaved, toggleSavedPair]
}

export function useSavedTokens(): [
  Record<string, SavedToken>,
  (address: string, symbol: string) => void,
  (address: string) => void
] {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const savedTokens = useAppSelector(state => state.user[activeNetwork]?.savedTokens)

  const addSavedToken = (address: string, symbol: string) => {
    dispatch(addToken({ id: address, symbol, networkId: activeNetwork }))
  }

  const removeSavedToken = (address: string) => {
    dispatch(removeToken({ id: address, networkId: activeNetwork }))
  }

  return [savedTokens, addSavedToken, removeSavedToken]
}

export function useToggleSavedToken(tokenAddress?: string, symbol?: string): [boolean, () => void] {
  const [savedTokens, addSavedToken, removeSavedToken] = useSavedTokens()
  const isSaved = tokenAddress && typeof savedTokens === 'object' && savedTokens[tokenAddress] ? true : false

  const toggleSavedToken = () => {
    if (tokenAddress && symbol) {
      if (isSaved) {
        removeSavedToken(tokenAddress)
      } else {
        addSavedToken(tokenAddress, symbol)
      }
    }
  }

  return [isSaved, toggleSavedToken]
}
