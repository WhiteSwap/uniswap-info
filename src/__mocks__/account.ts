export const UserHistoryMock = [
  {
    timestamp: 1_647_354_226,
    reserveUSD: 48_638.006_917,
    liquidityTokenBalance: 0.000_062_112_314_15,
    liquidityTokenTotalSupply: 0.000_062_802_1,
    reserveOne: 9.605_504_82,
    reserveTwo: 24_662.953_758,
    pair: {
      id: '0xa029a744b4e44e22f68a1bb9a848caafbf6bb233',
      reserveUSD: 51_481.780_709_5,
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
    date: 1_647_354_226,
    valueUSD: 0
  },
  {
    date: 1_647_440_626,
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
        price: 1032.232_453_242,
        reserve: 9.266_108_317_354_039,
        priceUSD: 1
      },
      tokenTwo: {
        id: 'THV4MnqnGk77YRDe3SPGzqFqC21cCjH2Fu',
        name: 'WSEDAO',
        symbol: 'WSD',
        price: 1032.232_453_242,
        reserve: 25_708.635_871,
        priceUSD: 1
      },
      dayVolumeUSD: 231.32,
      liquidityChangeUSD: 6712.234_562_8,
      totalLiquidityUSD: 132.242_453_362_8,
      volumeChangeUSD: 142.434_426_28,
      weekVolumeUSD: 122.2428,
      dayFees: 0,
      dayFeesChange: 0,
      apy: 0,
      totalSupply: 0,
      reserveUSD: 0
    },
    liquidityTokenBalance: 0.000_062_112_314_1,
    feeEarned: 51.760_385_036
  }
]

export const TopLpsMock = [
  {
    userId: 'TM1zzNDZD2DPASbKcgdVoTYhfmYgtfwx9R',
    pairName: 'ETH-USDT',
    pairAddress: '0xa029a744b4e44e22f68a1bb9a848caafbf6bb233',
    tokenOne: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    tokenTwo: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    usd: 50_826.933_152_378_85
  },
  {
    userId: 'TVMC8C7Y4f4ABr48PJencVdunVVB4XUW96',
    pairName: 'ETH-USDT',
    pairAddress: '0xa029a744b4e44e22f68a1bb9a848caafbf6bb233',
    tokenOne: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    tokenTwo: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    usd: 50_826.933_152_378_85
  }
]
