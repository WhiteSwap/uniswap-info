export const UserHistoryMock = [
  {
    timestamp: 1647354226,
    reserveUSD: '48638.00691716882881628117440734763',
    liquidityTokenBalance: '0.000062112314150737',
    liquidityTokenTotalSupply: '0.000062802119300004',
    reserve0: '9.605504826207720536',
    reserve1: '24662.953758',
    token0PriceUSD: '2531.777756462345477929943766308096',
    token1PriceUSD: '0.9860539697397754983107967437674589',
    pair: {
      id: '0xa029a744b4e44e22f68a1bb9a848caafbf6bb233',
      reserve0: '9.266108317973354039',
      reserve1: '25708.635871',
      reserveUSD: '51481.78070956633144714465392160739',
      token0: {
        id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        __typename: 'Token'
      },
      token1: {
        id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        __typename: 'Token'
      },
      __typename: 'Pair'
    },
    __typename: 'LiquidityPositionSnapshot'
  }
]

export const UserLiquidityChartMock = [
  {
    date: 1647354226,
    valueUSD: 0
  },
  {
    date: 1647440626,
    valueUSD: 0
  }
]

export const UserPositionsMock = [
  {
    pair: {
      id: '0xa029a744b4e44e22f68a1bb9a848caafbf6bb233',
      tokenOne: {
        id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        name: 'Wrapped Ethereum',
        symbol: 'WETH',
        price: 1032.232453242,
        derivedPrice: 1,
        reserve: 9.266108317354039,
        __typename: 'TokenPair'
      },
      tokenTwo: {
        id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        name: 'USDT',
        symbol: 'USDT',
        price: 1032.232453242,
        derivedPrice: 0.000360427813172301,
        reserve: 25708.635871,
        __typename: 'TokenPair'
      },
      dayVolumeUSD: 231.32,
      liquidityChangeUSD: 6712.2345628,
      totalLiquidityUSD: 132.2424533628,
      volumeChangeUSD: 142.43442628,
      weekVolumeUSD: 122.2428,
      __typename: 'Pair'
    },
    liquidityTokenBalance: '0.000062112314150737',
    feeEarned: 51.760385618796036,
    __typename: 'LiquidityPosition'
  }
]

export const TopLpsMock = [
  {
    user: {
      id: 'TM1zzNDZD2DPASbKcgdVoTYhfmYgtfwx9R',
      __typename: 'User'
    },
    pairName: 'ETH-USDT',
    pairAddress: '0xa029a744b4e44e22f68a1bb9a848caafbf6bb233',
    token0: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    token1: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    usd: 50826.93315237885
  },
  {
    user: {
      id: 'TVMC8C7Y4f4ABr48PJencVdunVVB4XUW96',
      __typename: 'User'
    },
    pairName: 'ETH-USDT',
    pairAddress: '0xa029a744b4e44e22f68a1bb9a848caafbf6bb233',
    token0: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    token1: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    usd: 50826.93315237885
  }
]
