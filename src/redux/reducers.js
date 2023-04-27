import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import counter from './slices/counter'
import wallet from './slices/wallet'
import trade from './slices/trade'

const rootReducer = combineReducers({ counter, wallet, trade })

const persistConfig = {
  key: 'root',
  storage,
}

const RootState = persistReducer(persistConfig, rootReducer)

export default RootState
