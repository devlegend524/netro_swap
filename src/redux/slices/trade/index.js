import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  from: {
    symbol: "ETH",
    name: "Ether",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    logoURI:
      "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png",
    decimals: 18
  },
  to: {
    name: "",
    symbol: "",
    address: "",
    logoURI: "",
    decimals: ""
  }
};

const tradeSlice = createSlice({
  name: "trade",
  initialState,
  reducers: {
    setTradeFrom: (state, action) => {
      state.from = action.payload;
    },
    setTradeTo: (state, action) => {
      state.to = action.payload;
    },
    initTradeInfo: (state, action) => {
      console.log(initialState);
      state.from = initialState.from;
      state.to = initialState.to;
    }
  }
});

export const { setTradeFrom, setTradeTo, initTradeInfo } = tradeSlice.actions;

export default tradeSlice.reducer;
