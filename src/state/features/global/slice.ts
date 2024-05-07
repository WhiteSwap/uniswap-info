import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SupportedNetwork } from 'constants/networks'
import {
  GlobalNetworkState,
  GlobalState,
  UpdateChartPayload,
  UpdateTransactionCountPayload,
  UpdatePricePayload,
  UpdateTransactionsPayload
} from './types'

const initialGlobalNetworkState: GlobalNetworkState = {
  chartData: undefined,
  transactions: undefined,
  dayTransactionCount: 0,
  price: 0
}

const initialState: GlobalState = {
  [SupportedNetwork.ETHEREUM]: initialGlobalNetworkState,
  [SupportedNetwork.POLYGON]: initialGlobalNetworkState,
  [SupportedNetwork.WHITECHAIN]: initialGlobalNetworkState,
  [SupportedNetwork.TRON]: initialGlobalNetworkState
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setTransactionCount: (
      state,
      { payload: { networkId, dayTransactionCount } }: PayloadAction<UpdateTransactionCountPayload>
    ) => {
      state[networkId].dayTransactionCount = dayTransactionCount
    },
    setTransactions: (state, { payload: { networkId, transactions } }: PayloadAction<UpdateTransactionsPayload>) => {
      state[networkId].transactions = transactions
    },
    setChart: (state, { payload: { networkId, data } }: PayloadAction<UpdateChartPayload>) => {
      state[networkId].chartData = data
    },
    setPrice: (state, { payload: { networkId, price } }: PayloadAction<UpdatePricePayload>) => {
      state[networkId].price = price
    }
  }
})

export const { setTransactionCount, setTransactions, setChart, setPrice } = globalSlice.actions

export default globalSlice.reducer
