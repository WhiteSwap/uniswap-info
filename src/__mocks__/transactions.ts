export const TransactionsMock: Transactions = {
  mints: [
    {
      hash: '0xd3400d97b921c69766226b66c50ee08e69009e0c939c5bea5d2f9a9f464aa151',
      timestamp: 1_648_645_734,
      tokenOne: {
        id: '',
        symbol: 'WETH',
        amount: 0.014_714_626_354_744_541
      },
      tokenTwo: {
        id: '',
        symbol: 'USDT',
        amount: 49.824_384_454_1
      },
      account: '0xf0c4fbf7a1ee512515a353fc8e824d36c43b5b22',
      amountUSD: 100.342_32,
      type: 'mint'
    },
    {
      hash: '0x6c55d6b590aaf4b59d3f67ed474e4f3a805d41c56f6390261d57ed7bf02a1ab1',
      timestamp: 1_647_354_226,
      tokenOne: {
        id: '',
        symbol: 'WETH',
        amount: 0.000_062_112_474_454_1
      },
      tokenTwo: {
        id: '',
        symbol: 'USDT',
        amount: 9.499_999_844_541
      },
      account: '0xb41c0bf57b94fc923940868f66e77e78d546af30',
      amountUSD: 48_103.777_371_359_79,
      type: 'mint'
    }
  ],
  burns: [
    {
      hash: '0x5fe667f561af90da575824a179b64a7284686a2ab4f7f59876400beb8c477934',
      timestamp: 1_647_344_798,
      tokenOne: {
        id: '',
        symbol: 'WETH',
        amount: 9.599_514_744_541
      },
      tokenTwo: {
        id: '',
        symbol: 'USDT',
        amount: 24_647.585_41
      },
      account: '0x2413f1e3e8341238d172c656bf6c2c1f26a13740',
      amountUSD: 48_497.259_439_69,
      type: 'burn'
    },
    {
      hash: '0xe5f465246f13d350feb8e30a89f59658b8aa548ff035f9cd28e904f1a53ccd16',
      timestamp: 1_646_403_435,
      tokenOne: {
        id: '',
        symbol: 'WETH',
        amount: 80.941_511_474_454_1
      },
      tokenTwo: {
        id: '',
        symbol: 'USDT',
        amount: 221_062.555
      },
      account: '0x7b22336debe319c3dfe8d6675bd7dea7689322f9',
      amountUSD: 442_622.154_122_2,
      type: 'burn'
    }
  ],
  swaps: [
    {
      hash: '0x460352edc2abdd9c0a5db56e134e0ae88ab6f47e1f412e1aad63ec3f9f6d2307',
      timestamp: 1_651_765_604,
      tokenOne: {
        id: '',
        symbol: 'WETH',
        amount: 0.266_214_744_541
      },
      tokenTwo: {
        id: '',
        symbol: 'USDT',
        amount: 758.165
      },
      account: '0xeef86c2e49e11345f1a693675df9a38f7d880c8f',
      amountUSD: 749.317_586_246_278,
      type: 'swap'
    },
    {
      hash: '0xffc8d220ea812a1da4de8019ef7bfd584a9431ae6e6c1638e1f2ae033ead833c',
      timestamp: 1_651_698_414,
      tokenOne: {
        id: '',
        symbol: 'WETH',
        amount: 0.231_253_445_41
      },
      tokenTwo: {
        id: '',
        symbol: 'USDT',
        amount: 664.9757
      },
      account: '0x4d944a25bc871d6c6ee08baef0b7da0b08e6b7b3',
      amountUSD: 673.092_736_746_69,
      type: 'swap'
    }
  ]
}
