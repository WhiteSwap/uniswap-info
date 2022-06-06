import { useState, useRef, useEffect, useMemo } from 'react'
import { Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, BarChart, Bar } from 'recharts'
import { RowBetween, AutoRow } from 'components/Row'
import { toK, toNiceDate, toNiceDateYear, formattedNum, getTimeframe } from 'utils'
import { OptionButton } from 'components/ButtonStyled'
import { usePairChartData, useHourlyRateData } from 'state/features/pairs/hooks'
import { timeframeOptions } from 'constants/index'
import { useMedia } from 'react-use'
import { EmptyCard } from 'components'
import DropdownSelect from 'components/DropdownSelect'
import CandleStickChart from 'components/CandleChart'
import LocalLoader from 'components/LocalLoader'
import { useDarkModeManager } from 'state/features/user/hooks'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'state/hooks'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { ChartWrapper, OptionsRow } from './styled'

const CHART_VIEW = {
  VOLUME: 'Volume',
  LIQUIDITY: 'Liquidity',
  RATE0: 'Rate 0',
  RATE1: 'Rate 1'
}

const PairChart = ({ address, color, base0, base1 }) => {
  const { t } = useTranslation()
  const [chartFilter, setChartFilter] = useState(CHART_VIEW.LIQUIDITY)

  const [timeWindow, setTimeWindow] = useState(timeframeOptions.MONTH)

  const [darkMode] = useDarkModeManager()
  const textColor = darkMode ? 'white' : 'black'

  // update the width on a window resize
  const ref = useRef()
  const isClient = typeof window === 'object'
  const [width, setWidth] = useState(ref?.current?.container?.clientWidth)
  const [height, setHeight] = useState(ref?.current?.container?.clientHeight)

  useEffect(() => {
    if (!isClient) {
      return false
    }
    function handleResize() {
      setWidth(ref?.current?.container?.clientWidth ?? width)
      setHeight(ref?.current?.container?.clientHeight ?? height)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [height, isClient, width])

  // get data for pair, and rates
  const activeNetworkId = useActiveNetworkId()
  const pairData = useAppSelector(state => state.pairs[activeNetworkId]?.[address])
  let chartData = usePairChartData(address)
  const hourlyData = useHourlyRateData(address, timeWindow)
  const hourlyRate0 = hourlyData && hourlyData[0]
  const hourlyRate1 = hourlyData && hourlyData[1]

  // formatted symbols for overflow
  const formattedSymbol0 =
    pairData?.tokenOne?.symbol.length > 6 ? pairData?.tokenOne?.symbol.slice(0, 5) + '...' : pairData?.tokenOne?.symbol
  const formattedSymbol1 =
    pairData?.tokenTwo?.symbol.length > 6 ? pairData?.tokenTwo?.symbol.slice(0, 5) + '...' : pairData?.tokenTwo?.symbol

  const below1600 = useMedia('(max-width: 1600px)')
  const below1080 = useMedia('(max-width: 1080px)')
  const below700 = useMedia('(max-width: 700px)')

  const utcStartTime = getTimeframe(timeWindow)
  chartData = chartData?.filter(entry => entry.date >= utcStartTime)

  const rate0 = pairData?.tokenOne ? `${formattedSymbol1}/${formattedSymbol0}` : undefined
  const rate1 = pairData?.tokenOne ? `${formattedSymbol0}/${formattedSymbol1}` : undefined

  const chartView = useMemo(() => {
    return {
      ...CHART_VIEW,
      RATE0: rate0 || 'Rate 0',
      RATE1: rate1 || 'Rate 1'
    }
  }, [pairData?.tokenOne])

  if (chartData && chartData.length === 0) {
    return (
      <ChartWrapper>
        <EmptyCard height="300px">No historical data yet.</EmptyCard>{' '}
      </ChartWrapper>
    )
  }

  /**
   * Used to format values on chart on scroll
   * Needs to be raw html for chart API to parse styles
   * @param {*} val
   */
  function valueFormatter(val) {
    if (chartFilter === chartView.RATE0) {
      return (
        formattedNum(val) +
        `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol1}/${formattedSymbol0}<span>`
      )
    }
    if (chartFilter === chartView.RATE1) {
      return (
        formattedNum(val) +
        `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol0}/${formattedSymbol1}<span>`
      )
    }
  }

  const aspect = below1080 ? 60 / 20 : below1600 ? 60 / 28 : 60 / 22

  return (
    <ChartWrapper>
      {below700 ? (
        <RowBetween mb={40}>
          <DropdownSelect options={chartView} active={chartFilter} setActive={setChartFilter} color={color} />
          <DropdownSelect options={timeframeOptions} active={timeWindow} setActive={setTimeWindow} color={color} />
        </RowBetween>
      ) : (
        <OptionsRow>
          <AutoRow>
            <OptionButton
              active={chartFilter === chartView.RATE0}
              onClick={() => {
                setTimeWindow(timeframeOptions.WEEK)
                setChartFilter(chartView.RATE0)
              }}
            >
              {rate0 || '-'}
            </OptionButton>
            <OptionButton
              active={chartFilter === chartView.RATE1}
              onClick={() => {
                setTimeWindow(timeframeOptions.WEEK)
                setChartFilter(chartView.RATE1)
              }}
            >
              {rate1 || '-'}
            </OptionButton>
          </AutoRow>
          <AutoRow justify="flex-end">
            <OptionButton
              active={chartFilter === chartView.LIQUIDITY}
              onClick={() => {
                setTimeWindow(timeframeOptions.ALL_TIME)
                setChartFilter(chartView.LIQUIDITY)
              }}
            >
              {t('liquidity')}
            </OptionButton>
            <OptionButton
              active={chartFilter === chartView.VOLUME}
              onClick={() => {
                setTimeWindow(timeframeOptions.ALL_TIME)
                setChartFilter(chartView.VOLUME)
              }}
            >
              {t('volume')}
            </OptionButton>
          </AutoRow>
          <AutoRow />
          <AutoRow justify="flex-end">
            <OptionButton
              active={timeWindow === timeframeOptions.WEEK}
              onClick={() => setTimeWindow(timeframeOptions.WEEK)}
            >
              1W
            </OptionButton>
            <OptionButton
              active={timeWindow === timeframeOptions.MONTH}
              onClick={() => setTimeWindow(timeframeOptions.MONTH)}
            >
              1M
            </OptionButton>
            <OptionButton
              active={timeWindow === timeframeOptions.ALL_TIME}
              onClick={() => setTimeWindow(timeframeOptions.ALL_TIME)}
            >
              {t('all')}
            </OptionButton>
          </AutoRow>
        </OptionsRow>
      )}
      {base0 && base1 ? (
        <>
          {chartFilter === chartView.LIQUIDITY && (
            <ResponsiveContainer aspect={aspect}>
              <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={chartData}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  tickLine={false}
                  axisLine={false}
                  interval="preserveEnd"
                  tickMargin={14}
                  minTickGap={80}
                  tickFormatter={tick => toNiceDate(tick)}
                  dataKey="date"
                  tick={{ fill: '#9D9FA2' }}
                  type="number"
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis
                  type="number"
                  orientation="right"
                  tickFormatter={tick => '$' + toK(tick)}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveEnd"
                  minTickGap={80}
                  yAxisId={0}
                  tickMargin={16}
                  tick={{ fill: '#9D9FA2' }}
                />
                <Tooltip
                  cursor={true}
                  formatter={val => formattedNum(val, true)}
                  labelFormatter={label => toNiceDateYear(label)}
                  labelStyle={{ paddingTop: 4 }}
                  contentStyle={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    borderColor: color,
                    color: 'black',
                    fontWeight: 500,
                    fontSize: 14
                  }}
                  wrapperStyle={{ top: -70, left: -10 }}
                />
                <Area
                  strokeWidth={1}
                  dot={false}
                  type="monotone"
                  name={' (USD)'}
                  dataKey="reserveUSD"
                  yAxisId={0}
                  stroke={color}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {chartFilter === chartView.RATE1 &&
            (hourlyRate1 ? (
              <ResponsiveContainer aspect={aspect} ref={ref}>
                <CandleStickChart
                  data={hourlyRate1}
                  base={base0}
                  margin={false}
                  width={width}
                  valueFormatter={valueFormatter}
                />
              </ResponsiveContainer>
            ) : (
              <LocalLoader />
            ))}
          {chartFilter === chartView.RATE0 &&
            (hourlyRate0 ? (
              <ResponsiveContainer aspect={aspect} ref={ref}>
                <CandleStickChart
                  data={hourlyRate0}
                  base={base1}
                  margin={false}
                  width={width}
                  valueFormatter={valueFormatter}
                />
              </ResponsiveContainer>
            ) : (
              <LocalLoader />
            ))}
          {chartFilter === chartView.VOLUME && (
            <ResponsiveContainer aspect={aspect}>
              <BarChart margin={{ top: 0, right: 10, bottom: 6, left: 10 }} barCategoryGap={1} data={chartData}>
                <XAxis
                  tickLine={false}
                  axisLine={false}
                  interval="preserveEnd"
                  minTickGap={80}
                  tickMargin={14}
                  tickFormatter={tick => toNiceDate(tick)}
                  dataKey="date"
                  tick={{ fill: textColor }}
                  type="number"
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis
                  type="number"
                  axisLine={false}
                  tickMargin={30}
                  tickFormatter={tick => '$' + toK(tick)}
                  tickLine={false}
                  orientation="right"
                  interval="preserveEnd"
                  minTickGap={80}
                  yAxisId={0}
                  tick={{ fill: textColor }}
                />
                <Tooltip
                  cursor={{ fill: color, opacity: 0.1 }}
                  formatter={val => formattedNum(val, true)}
                  labelFormatter={label => toNiceDateYear(label)}
                  labelStyle={{ paddingTop: 4 }}
                  contentStyle={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    borderColor: color,
                    color: 'black'
                  }}
                  wrapperStyle={{ top: -70, left: -10 }}
                />
                <Bar
                  type="monotone"
                  name={t('volume')}
                  dataKey="dailyVolumeUSD"
                  fill={color}
                  yAxisId={0}
                  stroke={color}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </>
      ) : (
        <LocalLoader />
      )}
    </ChartWrapper>
  )
}

export default PairChart
