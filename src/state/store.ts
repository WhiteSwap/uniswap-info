import { configureStore } from '@reduxjs/toolkit'
import * as Sentry from '@sentry/react'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from 'state/features'

const PERSISTED_KEYS: string[] = ['user']

const persistConfig = {
  key: 'root',
  storage,
  whitelist: PERSISTED_KEYS
}

const sentryReduxEnhancer = Sentry.createReduxEnhancer()

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  enhancers: [sentryReduxEnhancer],
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
