import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  account: null,
  assets: [],
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.account = action.payload
    },
    setAssets: (state, action) => {
      state.assets = action.payload
    },
  },
})

export const { setWallet, setAssets } = walletSlice.actions

export default walletSlice.reducer
