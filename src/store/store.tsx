import { configureStore, AnyAction } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'

import storage from 'redux-persist/lib/storage'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import auth from 'features/Login/authSlice'
import ui from './ui/UISlice'

const persistConfig = {
  key: 'artmed_auth',
  storage,
}

const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, auth),
  ui,
})

const reducerProxy = (state: any, action: AnyAction) => {
  if (action.type.includes('auth/logoutApp')) {
    return rootReducer(undefined, action)
  }

  return rootReducer(state, action)
}

const store = configureStore({
  reducer: reducerProxy,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()

const persistor = persistStore(store)

export { store, persistor }
