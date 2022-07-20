import { combineReducers } from '@reduxjs/toolkit'
import accountReducer from 'state/features/account/slice'
import applicationReducer from 'state/features/application/slice'
import globalReducer from 'state/features/global/slice'
import pairsReducer from 'state/features/pairs/slice'
import tokenReducer from 'state/features/token/slice'
import userReducer from 'state/features/user/slice'

const rootReducer = combineReducers({
  user: userReducer,
  application: applicationReducer,
  global: globalReducer,
  pairs: pairsReducer,
  account: accountReducer,
  token: tokenReducer
})

export default rootReducer
