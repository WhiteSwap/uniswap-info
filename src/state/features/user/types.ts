export interface NetworkSavedState {
  readonly savedAccounts: Array<string>
  readonly savedTokens: Record<string, SavedToken>
  readonly savedPairs: Record<string, SavedPair>
}

export type SavedPair = {
  address: string
  token0Address: string
  token1Address: string
  token0Symbol: string
  token1Symbol: string
}

export type SavedToken = {
  symbol: string
}

export type UserState = Record<SupportedNetwork, NetworkSavedState> & {
  darkMode: boolean
}

export type AddPairPayload = {
  networkId: SupportedNetwork
  pair: SavedPair
}

export type SavedItemPayload = {
  networkId: SupportedNetwork
  id: string
}

export type AddTokenPayload = SavedToken & SavedItemPayload
