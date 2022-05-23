import { SupportedNetwork } from './networks'

export type LogoUrls = Record<SupportedNetwork, string>
export type OverrideUrls = Record<SupportedNetwork, Record<string, string>>

export const LOGO_SOURCE: LogoUrls = {
  [SupportedNetwork.ETHEREUM]:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets',
  [SupportedNetwork.TRON]: 'https://coin.top/production/upload/logo'
}

export const LOGO_OVERRIDES: OverrideUrls = {
  [SupportedNetwork.ETHEREUM]: {
    '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb': `${LOGO_SOURCE.eth}/0x42456D7084eacF4083f1140d3229471bbA2949A8/logo.png`,
    '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f': `${LOGO_SOURCE.eth}/0xC011A72400E58ecD99Ee497CF89E3775d4bd732F/logo.png`,
    '0x77b8ae2e83c7d044d159878445841e2a9777af38':
      'https://coin.top/production/upload/logo/THV4MnqnGk77YRDe3SPGzqFqC21cCjH2Fu.png',
    '0x0423d7c27d1dde7eb4aae02dae6b651c7225e6f9':
      'https://coin.top/production/upload/logo/THV4MnqnGk77YRDe3SPGzqFqC21cCjH2Fu.png'
  },
  [SupportedNetwork.TRON]: {
    TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tron/assets/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t/logo.png'
  }
}
