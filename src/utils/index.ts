import { ApolloQueryResult } from 'apollo-boost'
import { BigNumber } from 'bignumber.js'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
// eslint-disable-next-line import/no-named-as-default
import Numeral from 'numeral'
import { timeframeOptions } from 'constants/index'
import { LOGO_OVERRIDES, LOGO_SOURCE } from 'constants/logo'
import {
  NetworkInfo,
  SUPPORTED_NETWORK_VERSIONS,
  TronNetworkInfo,
  SupportedNetwork,
  SUPPORTED_NETWORK_INFOS
} from 'constants/networks'
import { TOKEN_OVERRIDES, WETH_ADDRESS, WTRX_ADDRESS } from 'constants/tokens'

BigNumber.set({ EXPONENTIAL_AT: 50 })

export function getTimeframe(timeWindow: string) {
  const utcEndTime = dayjs.utc()
  // based on window, get starttime
  let utcStartTime
  switch (timeWindow) {
    case timeframeOptions.WEEK: {
      utcStartTime = utcEndTime.subtract(1, 'week').endOf('day').unix() - 1
      break
    }
    case timeframeOptions.MONTH: {
      utcStartTime = utcEndTime.subtract(1, 'month').endOf('day').unix() - 1
      break
    }
    case timeframeOptions.ALL_TIME:
    case timeframeOptions.YEAR: {
      utcStartTime = utcEndTime.subtract(1, 'year').endOf('day').unix() - 1
      break
    }
    default: {
      utcStartTime = utcEndTime.subtract(1, 'year').startOf('year').unix() - 1
      break
    }
  }
  return utcStartTime
}

function parseRouteAddress(address: string) {
  switch (address) {
    case WETH_ADDRESS: {
      return SupportedNetwork.ETHEREUM.toUpperCase()
    }
    case WTRX_ADDRESS: {
      return SupportedNetwork.TRON.toUpperCase()
    }
    default: {
      return address
    }
  }
}

export function getExchangeLink({
  network,
  type,
  inputCurrency,
  outputCurrency
}: {
  network: SupportedNetwork
  inputCurrency: string
  outputCurrency?: string
  type: 'remove' | 'add' | 'swap'
}) {
  let exchangePageRoute = ''
  switch (type) {
    case 'remove': {
      exchangePageRoute = 'pool/remove'
      break
    }
    case 'add': {
      exchangePageRoute = 'pool/add'
      break
    }
    case 'swap':
    default: {
      exchangePageRoute = 'swap'
      break
    }
  }
  //TODO: rename network to chain
  const networkInfo = SUPPORTED_NETWORK_INFOS[network]
  const url = new URL(`https://app.ws.exchange/${networkInfo?.dexUrlPrefix}/${exchangePageRoute}`)
  const inputCurrencyAddress = parseRouteAddress(inputCurrency)
  url.searchParams.set('inputCurrency', inputCurrencyAddress)
  if (outputCurrency) {
    const outputCurrencyAddress = parseRouteAddress(outputCurrency)
    url.searchParams.set('outputCurrency', outputCurrencyAddress)
  }
  return url.href
}

export function getWhiteSwapAppLink(network: SupportedNetwork, linkVariable: string) {
  const baseWhiteSwapUrl = `https://app.ws.exchange/${network}/stake`
  if (!linkVariable) {
    return baseWhiteSwapUrl
  }

  return `${baseWhiteSwapUrl}/${network.toUpperCase()}/${linkVariable}`
}

export function localNumber(value: string | number) {
  return Numeral(value).format('0,0')
}

export const toNiceDate = (date: number) => {
  return dayjs.utc(dayjs.unix(date)).format('MMM DD')
}

export function getTimestampsForChanges() {
  const utcCurrentTime = dayjs()
  const t1 = utcCurrentTime.subtract(1, 'day').startOf('minute').unix()
  const t2 = utcCurrentTime.subtract(2, 'day').startOf('minute').unix()
  const tWeek = utcCurrentTime.subtract(1, 'week').startOf('minute').unix()
  return [t1, t2, tWeek]
}

export async function splitQuery<T>(
  callback: (p: T[]) => Promise<ApolloQueryResult<any>>,
  list: T[],
  skipCount = 100
): Promise<any> {
  let fetchedData = {}
  let allFound = false
  let skip = 0

  while (!allFound) {
    let end = list.length
    if (skip + skipCount < list.length) {
      end = skip + skipCount
    }
    const sliced = list.slice(skip, end)
    const result = await callback(sliced)
    fetchedData = {
      ...fetchedData,
      ...result.data
    }
    if (Object.keys(result.data).length < skipCount || skip + skipCount > list.length) {
      allFound = true
    } else {
      skip += skipCount
    }
  }

  return fetchedData
}

/**
 * @notice Creates an evenly-spaced array of timestamps
 * @dev Periods include a start and end timestamp. For example, n periods are defined by n+1 timestamps.
 * @param {Int} timestamp_from in seconds
 * @param {Int} period_length in seconds
 * @param {Int} periods
 */
export function getTimestampRange(timestamp_from: number, period_length: number, periods: number) {
  const timestamps = []
  for (let index = 0; index <= periods; index++) {
    timestamps.push(timestamp_from + index * period_length)
  }
  return timestamps
}

export const toNiceDateYear = (date: number) => dayjs.utc(dayjs.unix(date)).format('MMMM DD, YYYY')

export function getTokenLogoUrl(network: SupportedNetwork, address: string) {
  const tokenAddress = network === SupportedNetwork.ETHEREUM ? checksumEthAddress(address) : address
  let url = ''
  switch (network) {
    case SupportedNetwork.ETHEREUM: {
      url = `${LOGO_SOURCE[network]}/${tokenAddress}/logo.png`
      break
    }
    case SupportedNetwork.POLYGON: {
      // FIXME: find solution to get polygon assets
      // url = `${LOGO_SOURCE[network]}/${tokenAddress.toString().toLowerCase()}.svg`
      url = ''
      break
    }
    case SupportedNetwork.TRON:
    default: {
      url = `${LOGO_SOURCE[network]}/${tokenAddress}.png`
      break
    }
  }

  return LOGO_OVERRIDES[network][address.toLowerCase()] || url
}

export const checksumEthAddress = (value: string) => {
  try {
    return ethers.getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

export const isTronAddress = (address: string) => {
  // TODO: update result with real validation
  return address.match(/T[\dA-Za-z]{33}/g)
}

export const isErcAddress = (value: string) => {
  return ethers.isAddress(value)
}

export const isValidAddress = (address: string, networkId: SupportedNetwork) => {
  switch (networkId) {
    case SupportedNetwork.ETHEREUM: {
      return Boolean(checksumEthAddress(address))
    }
    case SupportedNetwork.POLYGON: {
      return isErcAddress(address)
    }
    case SupportedNetwork.TRON: {
      return isTronAddress(address)
    }
    default: {
      return false
    }
  }
}

export const toK = (number: string) => {
  if (Number.isNaN(number)) {
    return '0'
  }
  const amountToFormat = Number(number).toFixed(4)
  return Numeral(amountToFormat).format('0.[00]a')
}

const BLOCK_CHAIN_SCAN_URL: Record<SupportedNetwork, string> = {
  [SupportedNetwork.ETHEREUM]: 'https://etherscan.io',
  [SupportedNetwork.POLYGON]: 'https://polygonscan.com',
  [SupportedNetwork.POLYGON_ZKEVM]: 'https://zkevm.polygonscan.com/',
  [SupportedNetwork.TRON]: 'https://tronscan.org/#'
}

export function getExplorerLink(
  networkId: SupportedNetwork,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const scanUrl = BLOCK_CHAIN_SCAN_URL[networkId]

  switch (type) {
    case 'transaction': {
      if (networkId === SupportedNetwork.TRON) {
        return `${scanUrl}/transaction/${data}`
      }
      return `${scanUrl}/tx/${data}`
    }
    case 'token': {
      if (networkId === SupportedNetwork.TRON) {
        return `${scanUrl}/token20/${data}`
      }
      return `${scanUrl}/token/${data}`
    }
    case 'block': {
      return `${scanUrl}/block/${data}`
    }
    case 'address':
    default: {
      return `${scanUrl}/address/${data}`
    }
  }
}

export function getViewOnScanKey(networkId: SupportedNetwork) {
  switch (networkId) {
    case SupportedNetwork.ETHEREUM: {
      return 'viewOnEtherscan'
    }
    case SupportedNetwork.POLYGON: {
      return 'View on Polygonscan'
    }
    case SupportedNetwork.TRON:
    default: {
      return 'viewOnTronScan'
    }
  }
}

export const formatTime = (unix: number) => {
  const now = dayjs()
  const timestamp = dayjs.unix(unix)

  const inSeconds = now.diff(timestamp, 'second')
  const inMinutes = now.diff(timestamp, 'minute')
  const inHours = now.diff(timestamp, 'hour')
  const inDays = now.diff(timestamp, 'day')

  if (inHours >= 24) {
    return `${inDays} ${inDays === 1 ? 'day' : 'days'} ago`
  } else if (inMinutes >= 60) {
    return `${inHours} ${inHours === 1 ? 'hour' : 'hours'} ago`
  } else if (inSeconds >= 60) {
    return `${inMinutes} ${inMinutes === 1 ? 'minute' : 'minutes'} ago`
  } else {
    return `${inSeconds} ${inSeconds === 1 ? 'second' : 'seconds'} ago`
  }
}

export const formatNumber = (number: number) => {
  return number.toString().replaceAll(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// using a currency library here in case we want to add more in future
const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const formattedNumber = (number?: number | string, usd = false) => {
  if (Number.isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0' : 0
  }
  const parsedNumber = typeof number === 'string' ? Number.parseFloat(number) : number

  if (parsedNumber > 500_000_000) {
    return (usd ? '$' : '') + toK(parsedNumber.toFixed(0))
  }

  if (parsedNumber === 0) {
    if (usd) {
      return '$0'
    }
    return 0
  }

  if (parsedNumber < 0.0001 && parsedNumber > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  if (parsedNumber > 1000) {
    return usd
      ? '$' + Number(parsedNumber.toFixed(0)).toLocaleString()
      : '' + Number(parsedNumber.toFixed(0)).toLocaleString()
  }

  if (usd) {
    if (parsedNumber < 0.1) {
      return '$' + Number(parsedNumber.toFixed(4))
    } else {
      const usdString = priceFormatter.format(parsedNumber)
      return '$' + usdString.slice(1, usdString.length)
    }
  }

  return Number(parsedNumber.toFixed(5))
}

export function rawPercent(percentRaw: number) {
  const percent = percentRaw * 100
  if (!percent || percent === 0) {
    return '0%'
  }
  if (percent < 1 && percent > 0) {
    return '< 1%'
  }
  return percent.toFixed(0) + '%'
}

export function parsePercent(percent: number) {
  if (!percent || percent === 0) {
    return { data: '0%' }
  }

  if (percent < 0.01 && percent > 0) {
    return { data: '< 0.01%', color: '#54B45D' }
  }

  if (percent < 0 && percent > -0.01) {
    return { data: '< 0.01%', color: '#C73846' }
  }

  const fixedPercent = percent.toFixed(2)
  if (fixedPercent === '0.00') {
    return { data: '0%' }
  }
  if (+fixedPercent > 0) {
    return +fixedPercent > 100
      ? { data: `+${percent?.toFixed(0).toLocaleString()}%`, color: '#54B45D' }
      : { data: `+${fixedPercent}%`, color: '#54B45D' }
  } else {
    return { data: `${fixedPercent}%`, color: '#C73846' }
  }
}

/**
 * gets the amoutn difference plus the % change in change itself (second order change)
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 * @param {*} value48HoursAgo
 */
export const get2DayPercentChange = (valueNow: any, value24HoursAgo: any, value48HoursAgo: any) => {
  // get volume info for both 24 hour periods
  const currentChange = Number.parseFloat(valueNow) - Number.parseFloat(value24HoursAgo)
  const previousChange = Number.parseFloat(value24HoursAgo) - Number.parseFloat(value48HoursAgo)

  const adjustedPercentChange = ((currentChange - previousChange) / previousChange) * 100

  if (Number.isNaN(adjustedPercentChange) || !Number.isFinite(adjustedPercentChange)) {
    return [currentChange, 0]
  }
  return [currentChange, adjustedPercentChange]
}

/**
 * get standard percent change between two values
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 */
export const getPercentChange = (valueNow: any, value24HoursAgo: any) => {
  const adjustedPercentChange =
    ((Number.parseFloat(valueNow) - Number.parseFloat(value24HoursAgo)) / Number.parseFloat(value24HoursAgo)) * 100
  if (Number.isNaN(adjustedPercentChange) || !Number.isFinite(adjustedPercentChange)) {
    return 0
  }
  return adjustedPercentChange
}

export function networkPrefix(activeNetwork: NetworkInfo) {
  return '/' + activeNetwork.route.toLocaleLowerCase()
}

export function getCurrentNetwork() {
  const locationNetworkId = location.pathname.split('/')[1]
  const newNetworkInfo = SUPPORTED_NETWORK_VERSIONS.find(n => locationNetworkId === n.route.toLowerCase())
  return newNetworkInfo || TronNetworkInfo
}

export function escapeRegExp(value: string) {
  return value.replaceAll(/[$()*+.?[\\\]^{|}]/g, '\\$&') // $& means the whole matched string
}

export function getChartData(data: ChartDailyItem[], field: keyof ChartDailyItem) {
  return data.map(entry => ({
    time: dayjs.unix(entry.date).utc().format('YYYY-MM-DD'),
    value: entry[field]
  }))
}

export function parseTokenInfo(field: 'name' | 'symbol', address?: string, defaultValue?: string) {
  return TOKEN_OVERRIDES[address || '']?.[field] || defaultValue || ''
}

export function ellipsisAddress(address: string): string {
  const length = address.length
  return address.slice(0, 6) + '...' + address.slice(length - 4, length)
}

export function specialChars(value: string) {
  const specialChars = /[ !"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~-]/
  return specialChars.test(value)
}
