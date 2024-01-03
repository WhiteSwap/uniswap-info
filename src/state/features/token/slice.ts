import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SupportedNetwork } from 'constants/networks'
import {
  TokenState,
  UpdateAllPairsPayload,
  UpdateChartDataPayload,
  UpdatePriceDataPayload,
  UpdateTokenPayload,
  UpdateTopTokensPayload,
  UpdateTransactionsPayload
} from './types'

const initialState: TokenState = {
  [SupportedNetwork.ETHEREUM]: {},
  [SupportedNetwork.POLYGON]: {},
  [SupportedNetwork.POLYGON_ZKEVM]: {},
  [SupportedNetwork.TRON]: {}
}

export const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setToken: (state, { payload: { networkId, data, tokenAddress } }: PayloadAction<UpdateTokenPayload>) => {
      state[networkId][tokenAddress] = { ...state[networkId][tokenAddress], ...data }
    },
    setTopTokens: (state, { payload: { networkId, topTokens } }: PayloadAction<UpdateTopTokensPayload>) => {
      const tokens = topTokens.reduce((accumulator, pair) => ({ ...accumulator, [pair.id]: pair }), {})
      state[networkId] = { ...tokens, ...state[networkId] }
    },
    setTransactions: (
      state,
      { payload: { networkId, transactions, address } }: PayloadAction<UpdateTransactionsPayload>
    ) => {
      state[networkId][address].transactions = transactions
    },
    setChartData: (state, { payload: { networkId, chartData, address } }: PayloadAction<UpdateChartDataPayload>) => {
      state[networkId][address].chartData = {
        ...state[networkId][address].chartData,
        ...chartData
      }
    },
    setPriceData: (
      state,
      { payload: { networkId, address, timeWindow, interval, data } }: PayloadAction<UpdatePriceDataPayload>
    ) => {
      state[networkId][address] = {
        ...state[networkId][address],
        timeWindowData: {
          ...state[networkId][address].timeWindowData,
          [timeWindow]: {
            ...state[networkId][address].timeWindowData?.[timeWindow],
            [interval]: data
          }
        }
      }
    },
    setTokenPairs: (state, { payload: { networkId, address, allPairs } }: PayloadAction<UpdateAllPairsPayload>) => {
      state[networkId] = {
        ...state[networkId],
        [address]: {
          ...state[networkId][address],
          tokenPairs: allPairs
        }
      }
    }
  }
})

export const { setToken, setTopTokens, setTransactions, setChartData, setPriceData, setTokenPairs } = tokenSlice.actions

export default tokenSlice.reducer
