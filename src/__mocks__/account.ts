export const UserHistoryMock = [
  {
    timestamp: 1647354226,
    reserveUSD: 48638.006917,
    liquidityTokenBalance: 0.00006211231415,
    liquidityTokenTotalSupply: 0.0000628021,
    reserveOne: 9.60550482,
    reserveTwo: 24662.953758,
    pair: {
      id: '0xa029a744b4e44e22f68a1bb9a848caafbf6bb233',
      reserveUSD: 51481.7807095,
      tokenOne: {
        id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        reserve: 0,
        priceUSD: 1
      },
      tokenTwo: {
        id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        reserve: 0,
        priceUSD: 1
      }
    }
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

export const UserPositionsMock: Position[] = [
  {
    pair: {
      id: 'TF93BSusoPh9fPa6fizSnRFV4zuyVgEwFY',
      tokenOne: {
        id: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        name: 'Tether',
        symbol: 'USDT',
        price: 1032.232453242,
        reserve: 9.266108317354039,
        priceUSD: 1
      },
      tokenTwo: {
        id: 'THV4MnqnGk77YRDe3SPGzqFqC21cCjH2Fu',
        name: 'WSEDAO',
        symbol: 'WSD',
        price: 1032.232453242,
        reserve: 25708.635871,
        priceUSD: 1
      },
      dayVolumeUSD: 231.32,
      liquidityChangeUSD: 6712.2345628,
      totalLiquidityUSD: 132.2424533628,
      volumeChangeUSD: 142.43442628,
      weekVolumeUSD: 122.2428,
      dayFees: 0,
      apy: 0,
      totalSupply: 0,
      reserveUSD: 0
    },
    liquidityTokenBalance: 0.0000621123141,
    feeEarned: 51.760385036
  }
]

export const TopLpsMock = [
  {
    userId: 'TM1zzNDZD2DPASbKcgdVoTYhfmYgtfwx9R',
    pairName: 'ETH-USDT',
    pairAddress: '0xa029a744b4e44e22f68a1bb9a848caafbf6bb233',
    tokenOne: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    tokenTwo: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    usd: 50826.93315237885
  },
  {
    userId: 'TVMC8C7Y4f4ABr48PJencVdunVVB4XUW96',
    pairName: 'ETH-USDT',
    pairAddress: '0xa029a744b4e44e22f68a1bb9a848caafbf6bb233',
    tokenOne: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    tokenTwo: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    usd: 50826.93315237885
  }
]
