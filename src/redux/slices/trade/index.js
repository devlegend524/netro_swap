import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chainId: 42161,
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
      console.log(action.payload);
      state.chainId = action.payload;
      if (action.payload === 56) {
        state.from = {
          symbol: "BNB",
          name: "BNB",
          address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          logoURI:
            "https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png",
          decimals: 18
        };
      } else {
        state.from = initialState.from;
      }
      state.to = initialState.to;
    }
  }
});

export const { setTradeFrom, setTradeTo, initTradeInfo } = tradeSlice.actions;

export default tradeSlice.reducer;
