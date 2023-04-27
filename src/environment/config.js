export const stakingContractAddress = '0xDa56F0c1E2C213d7e6ca396716c2745Ec000Cced'
export const NETRO_address = '0xFc5f2B58249d31a06d2F30E69F7b7839d4b88c4a'
export const NETRO_DECIMALS = 18
export const PROTOCOL_LIST = {
  ZKSYNC_MUTE: {
    url: function (tokenA, tokenB) {
      return `https://app.mute.io/swap?inputCurrency=${tokenA}&outputCurrency=${tokenB}`
    },
    name: 'Mute',
    icon: 'https://cdn.1inch.io/liquidity-sources-logo/mute_color.svg',
  },
  ZKSYNC_ONE_INCH_LIMIT_ORDER_V3: {
    url: function (tokenA, tokenB) {
      return `https://app.1inch.io/#/324/classic/swap/${tokenA}/${tokenB}`
    },
    name: '1inch',
    icon: 'https://cdn.1inch.io/liquidity-sources-logo/1inch_color.svg',
  },
  ZKSYNC_WETH: {
    url: function (tokenA, tokenB) {
      return `https://app.1inch.io/#/324/classic/swap/${tokenA}/${tokenB}`
    },
    name: '1inch',
    icon: 'https://cdn.1inch.io/liquidity-sources-logo/1inch_color.svg',
  },
  ZKSYNC_PMMX: {
    url: function (tokenA, tokenB) {
      return `https://app.velocore.xyz/swap/${tokenA}/${tokenB}`
    },
    name: 'Velcore',
    icon: 'https://cdn.1inch.io/liquidity-sources-logo/1inch_color.svg',
  },
  ZKSYNC_SPACEFI: {
    url: function (tokenA, tokenB) {
      return `https://swap-evmos.spacefi.io/#/swap?inputCurrency=${tokenA}&outputCurrency=${tokenB}`
    },
    name: 'SpaceFi',
    icon: 'https://cdn.1inch.io/liquidity-sources-logo/spacefi_color.svg',
  },
  ZKSYNC_SYNCSWAP: {
    url: function (tokenA, tokenB) {
      return `https://syncswap.xyz/swap?inputCurrency=${tokenA}&outputCurrency=${tokenB}`
    },
    name: 'SyncSwap',
    icon: 'https://cdn.1inch.io/liquidity-sources-logo/syncswap_color.svg',
  },
  ZKSYNC_GEM: {
    url: function (tokenA, tokenB) {
      return `https://zks.gemswap.online/swap?inputCurrency=${tokenA}&outputCurrency=${tokenB}`
    },
    name: 'GemSwap',
    icon: 'https://cdn.1inch.io/liquidity-sources-logo/gemswap_color.svg',
  },
  ZKSYNC_MAVERICK_V1: {
    url: function (tokenA, tokenB) {
      return `https://app.mav.xyz/?chain=324&tokenA=${
        tokenA === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' ? 'ETH' : tokenA
      }&tokenB=${tokenB}`
    },
    name: 'Maverick V1',
    icon: 'https://cdn.1inch.io/liquidity-sources-logo/maverick_color.svg',
  },
}
