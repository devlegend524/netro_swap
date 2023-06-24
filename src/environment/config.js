export const stakingContractAddress =
  "0xDa56F0c1E2C213d7e6ca396716c2745Ec000Cced";
export const NETRO_address = "0xFc5f2B58249d31a06d2F30E69F7b7839d4b88c4a";
export const netroPresaleContractAddress =
  "0xfC633918BFB8C29ecB14E3Ab1dC61099C76605de";
export const NETRO_DECIMALS = 18;
export const PROTOCOL_LIST = {
  ZKSYNC_MUTE: {
    url: function (tokenA, tokenB) {
      return `https://app.mute.io/swap?inputCurrency=${tokenA}&outputCurrency=${tokenB}`;
    },
    name: "Mute",
    icon: "https://cdn.1inch.io/liquidity-sources-logo/mute_color.svg"
  },
  ZKSYNC_ONE_INCH_LIMIT_ORDER_V3: {
    url: function (tokenA, tokenB) {
      return `https://app.1inch.io/#/324/classic/swap/${tokenA}/${tokenB}`;
    },
    name: "1inch",
    icon: "https://cdn.1inch.io/liquidity-sources-logo/1inch_color.svg"
  },
  ZKSYNC_WETH: {
    url: function (tokenA, tokenB) {
      return `https://app.1inch.io/#/324/classic/swap/${tokenA}/${tokenB}`;
    },
    name: "1inch",
    icon: "https://cdn.1inch.io/liquidity-sources-logo/1inch_color.svg"
  },
  ZKSYNC_PMMX: {
    url: function (tokenA, tokenB) {
      return `https://app.velocore.xyz/swap/${tokenA}/${tokenB}`;
    },
    name: "Velcore",
    icon: "https://cdn.1inch.io/liquidity-sources-logo/1inch_color.svg"
  },
  ZKSYNC_SPACEFI: {
    url: function (tokenA, tokenB) {
      return `https://swap-evmos.spacefi.io/#/swap?inputCurrency=${tokenA}&outputCurrency=${tokenB}`;
    },
    name: "SpaceFi",
    icon: "https://cdn.1inch.io/liquidity-sources-logo/spacefi_color.svg"
  },
  ZKSYNC_SYNCSWAP: {
    url: function (tokenA, tokenB) {
      return `https://syncswap.xyz/swap?inputCurrency=${tokenA}&outputCurrency=${tokenB}`;
    },
    name: "SyncSwap",
    icon: "https://cdn.1inch.io/liquidity-sources-logo/syncswap_color.svg"
  },
  ZKSYNC_GEM: {
    url: function (tokenA, tokenB) {
      return `https://zks.gemswap.online/swap?inputCurrency=${tokenA}&outputCurrency=${tokenB}`;
    },
    name: "GemSwap",
    icon: "https://cdn.1inch.io/liquidity-sources-logo/gemswap_color.svg"
  },
  ZKSYNC_MAVERICK_V1: {
    url: function (tokenA, tokenB) {
      return `https://app.mav.xyz/?chain=324&tokenA=${
        tokenA === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ? "ETH" : tokenA
      }&tokenB=${tokenB}`;
    },
    name: "Maverick V1",
    icon: "https://cdn.1inch.io/liquidity-sources-logo/maverick_color.svg"
  }
};

export const PROTOCOL_WHITE_LIST = {
  324: "ZKSYNC_MUTE,ZKSYNC_ONE_INCH_LIMIT_ORDER_V3,ZKSYNC_PMMX,ZKSYNC_SPACEFI,ZKSYNC_SYNCSWAP,ZKSYNC_GEM,ZKSYNC_MAVERICK_V1",
  42161:
    "ARBITRUM_BALANCER_V2,ARBITRUM_ONE_INCH_LIMIT_ORDER,ARBITRUM_ONE_INCH_LIMIT_ORDER_V2,ARBITRUM_ONE_INCH_LIMIT_ORDER_V3,ARBITRUM_DODO,ARBITRUM_DODO_V2,ARBITRUM_SUSHISWAP,ARBITRUM_DXSWAP,ARBITRUM_UNISWAP_V3,ARBITRUM_CURVE,ARBITRUM_CURVE_V2,ARBITRUM_GMX,ARBITRUM_SYNAPSE,ARBITRUM_PMM5,ARBITRUM_SADDLE,ARBITRUM_KYBERSWAP_ELASTIC,ARBITRUM_KYBER_DMM_STATIC,ARBITRUM_AAVE_V3,ARBITRUM_ELK,ARBITRUM_WOOFI_V2,ARBITRUM_CAMELOT,ARBITRUM_TRADERJOE,ARBITRUM_TRADERJOE_V2,ARBITRUM_SWAPFISH,ARBITRUM_PMM6,ARBITRUM_ZYBER,ARBITRUM_ZYBER_STABLE,ARBITRUM_SOLIDLIZARD,ARBITRUM_ZYBER_V3,ARBITRUM_MYCELIUM,ARBITRUM_TRIDENT,ARBITRUM_SHELL_OCEAN,ARBITRUM_RAMSES,ARBITRUM_TRADERJOE_V2_1,ARBITRUM_PMM8,ARBITRUM_NOMISWAPEPCS,ARBITRUM_CAMELOT_V3,ARBITRUM_WOMBATSWAP,ARBITRUM_PMM3,ARBITRUM_CHRONOS,ARBITRUM_LIGHTER,ARBITRUM_ARBIDEX,ARBITRUM_ARBIDEX_V3,ARBSWAP,ARBSWAP_STABLE",
  10: "OPTIMISM_UNISWAP_V3,OPTIMISM_SYNTHETIX,OPTIMISM_SYNTHETIX_WRAPPER,OPTIMISM_ONE_INCH_LIMIT_ORDER,OPTIMISM_ONE_INCH_LIMIT_ORDER_V2,OPTIMISM_ONE_INCH_LIMIT_ORDER_V3,OPTIMISM_CURVE,OPTIMISM_PMM6,OPTIMISM_BALANCER_V2,OPTIMISM_VELODROME,OPTIMISM_KYBERSWAP_ELASTIC,OPTIMISM_CLIPPER_COVES,OPTIMISM_KYBER_DMM_STATIC,OPTIMISM_AAVE_V3,OPTIMISM_ELK,OPTIMISM_WOOFI_V2,OPTIMISM_TRIDENT,OPTIMISM_MUMMY_FINANCE,OPTIMISM_NOMISWAPEPCS"
};
