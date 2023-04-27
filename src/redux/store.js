import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import thunk from 'redux-thunk'

import persistedReducer from './reducers'

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  // devTools: process.env.NODE_ENV !== 'production',
})

export const useAppDispatch = () => useDispatch()
export default store
