import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { timeframeOptions } from 'constants/index'
import { NetworkInfo } from 'constants/networks'
import { ApplicationState } from './types'
import { getCurrentNetwork } from 'utils'

const initialState: ApplicationState = {
  timeKey: timeframeOptions.ALL_TIME,
  latestBlock: 0,
  headBlock: 0,
  activeNetwork: getCurrentNetwork()
}

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setTimeFrame: (state, action: PayloadAction<string>) => {
      state.timeKey = action.payload
    },
    setLatestBlock: (state, action: PayloadAction<number>) => {
      state.latestBlock = action.payload
    },
    setHeadBlock: (state, action: PayloadAction<number>) => {
      state.headBlock = action.payload
    },
    setActiveNetwork: (state, action: PayloadAction<NetworkInfo>) => {
      state.activeNetwork = action.payload
    }
  }
})

export const { setTimeFrame, setLatestBlock, setHeadBlock, setActiveNetwork } = applicationSlice.actions

export default applicationSlice.reducer
