import React from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { zkSync, zkSyncTestnet, optimism, arbitrum } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import store from "./redux/store";
import PageRouter from "./router";
import { theme } from "./styles/theme";

const persistor = persistStore(store);

const { chains, provider } = configureChains(
  [zkSync, zkSyncTestnet, optimism, arbitrum],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "zksync",
  projectId: "85ea32d265dfc865d0672c8b6b5c53d2",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const App = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <WagmiConfig client={wagmiClient}>
              <RainbowKitProvider
                chains={chains}
                theme={darkTheme({
                  accentColor: "#202946",
                  accentColorForeground: "white",
                  borderRadius: "medium",
                  overlayBlur: "small"
                })}
              >
                <SnackbarProvider maxSnack={3}>
                  <RouterProvider router={PageRouter} />
                </SnackbarProvider>
              </RainbowKitProvider>
            </WagmiConfig>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
};

export default App;
