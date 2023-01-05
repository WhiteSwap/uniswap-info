export const FACTORY_ADDRESS = '0x69bd16aE6F507bd3Fc9eCC984d50b04F029EF677'

export const BUNDLE_ID = '1'

export const timeframeOptions = {
  WEEK: '1 week',
  MONTH: '1 month',
  // THREE_MONTHS: '3 months',
  YEAR: '1 year',
  ALL_TIME: 'All time'
}

// TODO: refactor timestamp options
export const timestampUnitType: Record<string, TimeWindow> = {
  '1 week': 'week',
  '1 month': 'month',
  '1 year': 'year'
}

// token list urls to fetch tokens from - use for warnings on tokens and pairs
export const SUPPORTED_LIST_URLS__NO_ENS = ['https://app.ws.exchange/assets/whiteswap-default.tokenlist.json']

// hide from overview list
export const OVERVIEW_TOKEN_BLACKLIST = [
  '0x495c7f3a713870f68f8b418b355c085dfdc412c3',
  '0xc3761eb917cd790b30dad99f6cc5b4ff93c4f9ea',
  '0xe31debd7abff90b06bca21010dd860d8701fd901',
  '0xfc989fbb6b3024de5ca0144dc23c18a063942ac1'
]

// pair blacklist
export const PAIR_BLACKLIST = ['0xb6a741f37d6e455ebcc9f17e2c16d0586c3f57a5']
