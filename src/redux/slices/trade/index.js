import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  from: {
    name: 'WETH',
    contractAddress: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    icon: 'https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/eth.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615',
  },
  to: {
    name: 'USDC',
    contractAddress: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
    icon: 'https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/usdc.svg?alt=media&token=1985e3d8-3aa7-4d04-8839-565d4c341615',
  },
}

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setTradeFrom: (state, action) => {
      state.from = action.payload
    },
    setTradeTo: (state, action) => {
      state.to = action.payload
    },
  },
})

export const { setTradeFrom, setTradeTo } = tradeSlice.actions

export default tradeSlice.reducer
