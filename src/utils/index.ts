import { ApolloQueryResult } from 'apollo-boost'
import { BigNumber } from 'bignumber.js'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import cryptoValidator from 'multicoin-address-validator'
// eslint-disable-next-line import/no-named-as-default
import Numeral from 'numeral'
import { timeframeOptions } from 'constants/index'
import { LOGO_OVERRIDES, LOGO_SOURCE } from 'constants/logo'
import { NetworkInfo, SupportedNetwork, SUPPORTED_NETWORK_VERSIONS, TronNetworkInfo } from 'constants/networks'
import { TOKEN_OVERRIDES } from 'constants/tokens'
import { client } from 'service/client'
import { GET_BLOCK, GET_BLOCKS, SHARE_VALUE } from 'service/queries/ethereum/global'

BigNumber.set({ EXPONENTIAL_AT: 50 })

export function getTimeframe(timeWindow: string) {
  const utcEndTime = dayjs.utc()
  // based on window, get starttime
  let utcStartTime
  switch (timeWindow) {
    case timeframeOptions.WEEK:
      utcStartTime = utcEndTime.subtract(1, 'week').endOf('day').unix() - 1
      break
    case timeframeOptions.MONTH:
      utcStartTime = utcEndTime.subtract(1, 'month').endOf('day').unix() - 1
      break
    case timeframeOptions.ALL_TIME:
      utcStartTime = utcEndTime.subtract(1, 'year').endOf('day').unix() - 1
      break
    default:
      utcStartTime = utcEndTime.subtract(1, 'year').startOf('year').unix() - 1
      break
  }
  return utcStartTime
}

function parseAddress0ForRoute(token0Address: string) {
  switch (token0Address) {
    case '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2':
      return 'ETH'

    case 'TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR':
      return 'TRX'

    default:
      return token0Address
  }
}

function parseAddress1ForRoute(network: SupportedNetwork, token1Address: string | null) {
  switch (token1Address) {
    case null:
      return network.toUpperCase()

    case '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2':
      return 'ETH'

    case 'TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR':
      return 'TRX'

    default:
      return token1Address
  }
}

export function getPoolLink(
  network: SupportedNetwork,
  token0Address: string,
  token1Address: string | null,
  remove = false
) {
  const poolPage = remove ? 'remove' : 'add'
  const updatedAddress0 = parseAddress0ForRoute(token0Address)
  const updatedAddress1 = parseAddress1ForRoute(network, token1Address)
  return `https://app.ws.exchange/${network}/${poolPage}/${updatedAddress0}/${updatedAddress1}`
}

export function getSwapLink(network: SupportedNetwork, token0Address: string, token1Address: string | null) {
  const updatedAddress0 = parseAddress0ForRoute(token0Address)
  if (!token1Address) {
    return `https://app.ws.exchange/${network}/swap?inputCurrency=${updatedAddress0}`
  }
  const updatedAddress1 = parseAddress1ForRoute(network, token1Address)
  return `https://app.ws.exchange/${network}/swap?inputCurrency=${updatedAddress0}&outputCurrency=${updatedAddress1}`
}

export function getMiningPoolLink(network: SupportedNetwork, token0Address: string) {
  return `https://app.ws.exchange/${network}/stake/${network.toUpperCase()}/${token0Address}`
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
 * @notice Fetches first block after a given timestamp
 * @dev Query speed is optimized by limiting to a 600-second period
 * @param {Int} timestamp in seconds
 */
export async function getBlockFromTimestamp(timestamp: number) {
  const result = await client.query({
    query: GET_BLOCK,
    variables: {
      timestampFrom: timestamp,
      timestampTo: timestamp + 600
    },
    context: {
      client: 'block'
    }
  })
  return +result?.data?.blocks?.[0]?.number
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @dev blocks are returned in chronological order (ASC) regardless of input.
 * @dev blocks are returned at string representations of Int
 * @dev timestamps are returns as they were provided; not the block time.
 * @param {Array} timestamps
 */
export async function getBlocksFromTimestamps(timestamps: number[], skipCount = 500) {
  if (timestamps?.length === 0) {
    return []
  }

  const fetchedData = await splitQuery(
    parameters =>
      client.query({
        query: GET_BLOCKS(parameters),
        context: {
          client: 'block'
        }
      }),
    timestamps,
    skipCount
  )

  const blocks = []
  if (fetchedData) {
    for (const t in fetchedData) {
      if (fetchedData[t].length > 0) {
        blocks.push({
          timestamp: t.split('t')[1],
          number: +fetchedData[t][0]['number']
        })
      }
    }
  }
  return blocks
}

/**
 * @notice Example query using time travel queries
 * @dev TODO - handle scenario where blocks are not available for a timestamps (e.g. current time)
 * @param {String} pairAddress
 * @param {Array} timestamps
 */
export async function getShareValueOverTime(pairAddress: string, timestamps: number[]) {
  if (!timestamps) {
    const utcCurrentTime = dayjs()
    const utcSevenDaysBack = utcCurrentTime.subtract(8, 'day').unix()
    timestamps = getTimestampRange(utcSevenDaysBack, 86_400, 7)
  }

  // get blocks based on timestamps
  const blocks = await getBlocksFromTimestamps(timestamps)

  // get historical share values with time travel queries
  const result = await client.query({
    query: SHARE_VALUE(pairAddress, blocks),
    fetchPolicy: 'no-cache'
  })

  const values: any[] = []
  for (const row in result?.data) {
    const timestamp = row.split('t')[1]
    if (timestamp) {
      values.push({
        timestamp: +timestamp,
        liquidityTokenTotalSupply: +result.data[row].totalSupply,
        pair: {
          id: result.data[row].id,
          tokenOne: {
            id: result.data[row].token0.id,
            priceUSD: 0
          },
          tokenTwo: {
            id: result.data[row].token1.id,
            priceUSD: 0
          }
        },
        reserveOne: +result.data[row].reserve0,
        reserveTwo: +result.data[row].reserve1,
        reserveUSD: +result.data[row].reserveUSD,
        token0DerivedETH: +result.data[row].token0.derivedETH,
        token1DerivedETH: +result.data[row].token1.derivedETH
      })
    }
  }

  // add eth prices
  let index = 0
  for (const brow in result?.data) {
    const timestamp = brow.split('b')[1]
    if (timestamp) {
      values[index].pair.tokenOne.priceUSD = result.data[brow].ethPrice * values[index].token0DerivedETH
      values[index].pair.tokenTwo.priceUSD = result.data[brow].ethPrice * values[index].token1DerivedETH
      index += 1
    }
  }

  return values
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
  let urlPrefix = ''
  switch (network) {
    case SupportedNetwork.ETHEREUM:
      urlPrefix = '/logo.png'
      break
    case SupportedNetwork.TRON:
    default:
      urlPrefix = '.png'
      break
  }
  return LOGO_OVERRIDES[network][address] || `${LOGO_SOURCE[network]}/${tokenAddress}${urlPrefix}`
}

export const checksumEthAddress = (value: string) => {
  try {
    return ethers.utils.getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

export const isTronAddress = (value: string) => {
  return cryptoValidator.validate(value, SupportedNetwork.TRON)
}

export const isValidAddress = (address: string, networkId: SupportedNetwork) => {
  switch (networkId) {
    case SupportedNetwork.ETHEREUM:
      return Boolean(checksumEthAddress(address))
    case SupportedNetwork.TRON:
    default:
      return isTronAddress(address)
  }
}

export const toK = (number: string) => {
  return Numeral(number).format('0.[00]a')
}

const BLOCK_CHAIN_SCAN_URL: Record<SupportedNetwork, string> = {
  [SupportedNetwork.ETHEREUM]: 'https://etherscan.io',
  [SupportedNetwork.TRON]: 'https://tronscan.org/#'
}

export function getBlockChainScanLink(
  networkId: SupportedNetwork,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const scanUrl = BLOCK_CHAIN_SCAN_URL[networkId]

  switch (type) {
    case 'transaction': {
      if (networkId === SupportedNetwork.ETHEREUM) {
        return `${scanUrl}/tx/${data}`
      }
      return `${scanUrl}/transaction/${data}`
    }
    case 'token': {
      if (networkId === SupportedNetwork.ETHEREUM) {
        return `${scanUrl}/token/${data}`
      }
      return `${scanUrl}/token20/${data}`
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
    case SupportedNetwork.ETHEREUM:
      return 'viewOnEtherscan'
    case SupportedNetwork.TRON:
    default:
      return 'viewOnTronScan'
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
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
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

  if (percent < 0.0001 && percent > 0) {
    return { data: '< 0.0001%', color: '#54B45D' }
  }

  if (percent < 0 && percent > -0.0001) {
    return { data: '< 0.0001%', color: '#C73846' }
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
  return newNetworkInfo ? newNetworkInfo : TronNetworkInfo
}

export function escapeRegExp(value: string) {
  return value.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&') // $& means the whole matched string
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
