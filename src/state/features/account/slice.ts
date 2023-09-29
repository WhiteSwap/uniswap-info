import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SupportedNetwork } from 'constants/networks'
import {
  AccountState,
  UpdatePositionsPayload,
  UpdateTransactionsPayload,
  UpdatePairReturnsPayload,
  UpdateTopLiquidityPositionsPayload,
  AccountStatistics
} from './types'

const initialNetworkAccountState: AccountStatistics = {
  topLiquidityPositions: undefined,
  byAddress: {}
}

const initialState: AccountState = {
  [SupportedNetwork.ETHEREUM]: initialNetworkAccountState,
  [SupportedNetwork.POLYGON]: initialNetworkAccountState,
  [SupportedNetwork.TRON]: initialNetworkAccountState
}

export const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setTransactions: (
      state,
      { payload: { networkId, transactions, account } }: PayloadAction<UpdateTransactionsPayload>
    ) => {
      state[networkId].byAddress[account] = { ...state[networkId].byAddress[account], transactions }
    },
    setPositions: (state, { payload: { networkId, account, positions } }: PayloadAction<UpdatePositionsPayload>) => {
      state[networkId].byAddress[account] = { ...state[networkId].byAddress[account], positions }
    },
    setPairReturns: (
      state,
      { payload: { networkId, account, pairAddress, data } }: PayloadAction<UpdatePairReturnsPayload>
    ) => {
      const statePairReturns = state[networkId].byAddress[account]?.pairReturns?.[pairAddress]
      state[networkId].byAddress[account] = {
        ...state[networkId].byAddress[account],
        pairReturns: {
          ...state[networkId].byAddress[account]?.pairReturns,
          [pairAddress]: {
            liquidity: { ...statePairReturns?.liquidity, ...data?.liquidity },
            fee: { ...statePairReturns?.fee, ...data?.fee }
          }
        }
      }
    },
    setTopLiquidityPositions: (
      state,
      { payload: { networkId, liquidityPositions } }: PayloadAction<UpdateTopLiquidityPositionsPayload>
    ) => {
      state[networkId].topLiquidityPositions = liquidityPositions
    }
  }
})

export const { setTransactions, setPositions, setPairReturns, setTopLiquidityPositions } = accountSlice.actions

export default accountSlice.reducer
