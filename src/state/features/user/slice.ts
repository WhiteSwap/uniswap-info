import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AddPairPayload, AddTokenPayload, SavedItemPayload, UserState, NetworkSavedState } from './types'
import { SupportedNetwork } from 'constants/networks'

const initialNetworkSavedState: NetworkSavedState = {
  savedAccounts: [],
  savedTokens: {},
  savedPairs: {}
}

const initialState: UserState = {
  darkMode: true,
  [SupportedNetwork.ETHEREUM]: initialNetworkSavedState,
  [SupportedNetwork.POLYGON]: initialNetworkSavedState,
  [SupportedNetwork.TRON]: initialNetworkSavedState
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
    },
    addToken: (state, { payload: { id, networkId, symbol } }: PayloadAction<AddTokenPayload>) => {
      state[networkId].savedTokens[id] = { symbol }
    },
    removeToken: (state, { payload: { networkId, id } }: PayloadAction<SavedItemPayload>) => {
      delete state[networkId].savedTokens[id]
    },
    addPair: (state, { payload: { networkId, pair } }: PayloadAction<AddPairPayload>) => {
      state[networkId].savedPairs[pair.address] = pair
    },
    removePair: (state, { payload: { networkId, id } }: PayloadAction<SavedItemPayload>) => {
      delete state[networkId].savedPairs[id]
    },
    addAccount: (state, { payload: { networkId, id } }: PayloadAction<SavedItemPayload>) => {
      state[networkId].savedAccounts.push(id)
    },
    removeAccount: (state, { payload: { networkId, id } }: PayloadAction<SavedItemPayload>) => {
      const savedAccounts = state[networkId].savedAccounts
      const index = savedAccounts.indexOf(id)
      if (index > -1) {
        savedAccounts.splice(index, 1)
      }
    }
  }
})

export const { addPair, removePair, addToken, removeToken, addAccount, removeAccount, setDarkMode } = userSlice.actions

export default userSlice.reducer
