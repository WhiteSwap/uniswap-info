import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SupportedNetwork } from 'constants/networks'
import {
  AccountState,
  UpdatePositionHistoryPayload,
  UpdatePairReturnsPayload,
  UpdateLiquidityChartDataPayload
} from './types'

const initialState: AccountState = {
  [SupportedNetwork.ETHEREUM]: {},
  [SupportedNetwork.TRON]: {}
}

export const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setLiquidityChartData: (
      state,
      { payload: { networkId, account, data } }: PayloadAction<UpdateLiquidityChartDataPayload>
    ) => {
      state[networkId][account] = {
        ...state[networkId][account],
        liquidityChartData: { ...state[networkId][account]?.liquidityChartData, ...data }
      }
    },
    setPositionHistory: (
      state,
      { payload: { networkId, account, historyData } }: PayloadAction<UpdatePositionHistoryPayload>
    ) => {
      state[networkId][account] = {
        ...state[networkId][account],
        liquiditySnapshots: historyData
      }
    },
    setPositionChartData: (
      state,
      { payload: { networkId, account, pairAddress, data } }: PayloadAction<UpdatePairReturnsPayload>
    ) => {
      state[networkId][account] = {
        ...state[networkId][account],
        positionChartData: {
          ...state[networkId][account]?.positionChartData,
          [pairAddress]: { ...state[networkId][account]?.positionChartData?.[pairAddress], ...data }
        }
      }
    }
  }
})

export const { setPositionHistory, setPositionChartData, setLiquidityChartData } = accountSlice.actions

export default accountSlice.reducer
