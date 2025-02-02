import { configureStore } from '@reduxjs/toolkit'
import { contractsApi } from './services/contract'
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
  reducer: {
    [contractsApi.reducerPath]:contractsApi.reducer,
  },
  middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware().concat(contractsApi.middleware)
})

setupListeners(store.dispatch)