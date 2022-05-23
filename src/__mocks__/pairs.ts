export const TronPairListMock: Pair[] = [
  {
    id: '0xa029a744b4e44e22f68a1bb9a848caafbf6bb233',
    tokenOne: {
      id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      symbol: 'TRX',
      name: 'Tron',
      reserve: 123,
      price: 11.049537683966,
      priceUSD: 1
    },
    tokenTwo: {
      id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      symbol: 'USDT',
      name: 'Tether',
      reserve: 123,
      price: 11.049537683966,
      priceUSD: 1
    },
    totalLiquidityUSD: 51481.7809566331,
    totalSupply: 0.000062912561080272,
    untrackedVolumeUSD: '9944229.970965634522059318704069327',
    dayVolumeUSD: 749.3175862468779,
    weekVolumeUSD: 1902.4093218129128,
    dayFees: 0,
    apy: 1,
    volumeChangeUSD: 11.324568716658147,
    oneDayVolumeUntracked: 749.3175862468779,
    volumeChangeUntracked: 11.324568716658147,
    trackedReserveUSD: 51481.78070956632,
    liquidityChangeUSD: -2.8252342380985493,
    reserveUSD: '100652.43127238257'
  }
]

export const PairChartDataMock = [
  {
    date: 1604966400,
    dailyVolumeToken0: '0.277842834486998124',
    dailyVolumeToken1: '218.289304',
    dailyVolumeUSD: 113.77436599909711,
    reserveUSD: 11402.740180675813,
    __typename: 'PairDayData'
  },
  {
    date: 1605052800,
    dailyVolumeToken0: '1.908686467028167026',
    dailyVolumeToken1: '886.177257',
    dailyVolumeUSD: 885.3690331523312,
    reserveUSD: 101172.07174987419,
    __typename: 'PairDayData'
  },
  {
    date: 1605139200,
    dailyVolumeToken0: '4.726195736637975084',
    dailyVolumeToken1: '2181.912984',
    dailyVolumeUSD: 2175.627462447531,
    reserveUSD: 100652.43127238257,
    __typename: 'PairDayData'
  }
]

export const HourlyRateDataMock = [
  [
    {
      timestamp: '1649235600',
      open: 0.0002990433038514134,
      close: 0.0002990433038514134
    },
    {
      timestamp: '1649239200',
      open: 0.0002990433038514134,
      close: 0.0002990433038514134
    },
    {
      timestamp: '1649242800',
      open: 0.0002990433038514134,
      close: 0.0002990433038514134
    }
  ],
  [
    {
      timestamp: '1649235600',
      open: 3343.9972977855846,
      close: 3343.9972977855846
    },
    {
      timestamp: '1649239200',
      open: 3343.9972977855846,
      close: 3343.9972977855846
    },
    {
      timestamp: '1649242800',
      open: 3343.9972977855846,
      close: 3343.9972977855846
    },
    {
      timestamp: '1649246400',
      open: 3343.9972977855846,
      close: 3343.9972977855846
    }
  ]
]
