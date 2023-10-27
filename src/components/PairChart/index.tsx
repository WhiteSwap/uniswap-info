import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useMedia } from 'react-use'
import { Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, BarChart, Bar } from 'recharts'
import { useTheme } from 'styled-components'
import { EmptyCard } from 'components'
import { OptionButton } from 'components/ButtonStyled'
import CandleStickChart from 'components/CandleChart'
import ComingSoon from 'components/ComingSoon'
import DropdownSelect from 'components/DropdownSelect'
import LocalLoader from 'components/LocalLoader'
import { RowBetween, AutoRow } from 'components/Row'
import { timeframeOptions } from 'constants/index'
import { SupportedNetwork } from 'constants/networks'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { usePairChartData, useHourlyRateData } from 'state/features/pairs/hooks'
import { useDarkModeManager } from 'state/features/user/hooks'
import { useAppSelector } from 'state/hooks'
import { toK, toNiceDate, toNiceDateYear, formattedNumber } from 'utils'
import { ChartWrapper, OptionsRow } from './styled'

const PairChart = () => {
  const { t } = useTranslation()
  const parameters = useParams()
  const theme = useTheme()
  const chartColor = theme.blue
  const address = parameters.pairAddress!
  const [timeWindow, setTimeWindow] = useState(timeframeOptions.MONTH)
  const activeNetwork = useActiveNetworkId()

  const isPolygon = activeNetwork === SupportedNetwork.POLYGON

  const [darkMode] = useDarkModeManager()
  const textColor = darkMode ? 'white' : 'black'

  // get data for pair, and rates
  const activeNetworkId = useActiveNetworkId()
  const tokenOne = useAppSelector(state => state.pairs[activeNetworkId]?.[address]?.tokenOne)
  const tokenTwo = useAppSelector(state => state.pairs[activeNetworkId]?.[address]?.tokenTwo)
  const chartData = usePairChartData(address, timeWindow)

  // formatted symbols for overflow
  const formattedSymbol0 = tokenOne?.symbol.length > 6 ? tokenOne.symbol.slice(0, 5) + '...' : tokenOne?.symbol
  const formattedSymbol1 = tokenTwo?.symbol.length > 6 ? tokenTwo.symbol.slice(0, 5) + '...' : tokenTwo?.symbol

  const below1600 = useMedia('(max-width: 1600px)')
  const below1080 = useMedia('(max-width: 1080px)')
  const below700 = useMedia('(max-width: 700px)')

  const rate0 = tokenOne ? `${formattedSymbol0}/${formattedSymbol1}` : undefined
  const rate1 = tokenOne ? `${formattedSymbol1}/${formattedSymbol0}` : undefined

  const chartView = useMemo(() => {
    return {
      VOLUME: 'Volume',
      LIQUIDITY: 'Liquidity',
      RATE0: rate0 || 'Rate 0',
      RATE1: rate1 || 'Rate 1'
    }
  }, [rate0, rate1])
  const [chartFilter, setChartFilter] = useState(chartView.LIQUIDITY)
  const hourlyData = useHourlyRateData(
    address,
    timeWindow,
    chartFilter === chartView.RATE0 || chartFilter === chartView.RATE1,
    chartFilter === chartView.RATE1
  )
  const base0 = tokenTwo?.reserve / tokenOne?.reserve
  const base1 = tokenOne?.reserve / tokenTwo?.reserve

  if (chartData && chartData.length === 0) {
    return (
      <ChartWrapper>
        <EmptyCard height="300px">No historical data yet.</EmptyCard>{' '}
      </ChartWrapper>
    )
  }

  const aspect = below1080 ? 60 / 20 : below1600 ? 60 / 28 : 60 / 22

  if (isPolygon) {
    return (
      <ChartWrapper>
        {below700 ? (
          <RowBetween mb={40}>
            <DropdownSelect options={chartView} active={chartFilter} setActive={setChartFilter} color={chartColor} />
            <DropdownSelect
              options={timeframeOptions}
              active={timeWindow}
              setActive={setTimeWindow}
              color={chartColor}
            />
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
                  setTimeWindow(timeframeOptions.YEAR)
                  setChartFilter(chartView.LIQUIDITY)
                }}
              >
                {t('liquidity')}
              </OptionButton>
              <OptionButton
                active={chartFilter === chartView.VOLUME}
                onClick={() => {
                  setTimeWindow(timeframeOptions.YEAR)
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
                active={timeWindow === timeframeOptions.YEAR}
                onClick={() => setTimeWindow(timeframeOptions.YEAR)}
              >
                1Y
              </OptionButton>
            </AutoRow>
          </OptionsRow>
        )}
        <ComingSoon />
      </ChartWrapper>
    )
  }

  return (
    <ChartWrapper>
      {below700 ? (
        <RowBetween mb={40}>
          <DropdownSelect options={chartView} active={chartFilter} setActive={setChartFilter} color={chartColor} />
          <DropdownSelect options={timeframeOptions} active={timeWindow} setActive={setTimeWindow} color={chartColor} />
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
                setTimeWindow(timeframeOptions.YEAR)
                setChartFilter(chartView.LIQUIDITY)
              }}
            >
              {t('liquidity')}
            </OptionButton>
            <OptionButton
              active={chartFilter === chartView.VOLUME}
              onClick={() => {
                setTimeWindow(timeframeOptions.YEAR)
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
              active={timeWindow === timeframeOptions.YEAR}
              onClick={() => setTimeWindow(timeframeOptions.YEAR)}
            >
              1Y
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
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
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
                  formatter={(value: string | number) => formattedNumber(value, true)}
                  labelFormatter={label => toNiceDateYear(label)}
                  labelStyle={{ paddingTop: 4 }}
                  contentStyle={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    borderColor: chartColor,
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
                  dataKey="liquidityUSD"
                  yAxisId={0}
                  stroke={chartColor}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {chartFilter === chartView.RATE0 &&
            (hourlyData ? (
              <ResponsiveContainer aspect={aspect}>
                <CandleStickChart data={hourlyData} base={base0} />
              </ResponsiveContainer>
            ) : (
              <LocalLoader />
            ))}
          {chartFilter === chartView.RATE1 &&
            (hourlyData ? (
              <ResponsiveContainer aspect={aspect}>
                <CandleStickChart data={hourlyData} base={base1} />
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
                  cursor={{ fill: chartColor, opacity: 0.1 }}
                  formatter={(value: string | number) => formattedNumber(value, true)}
                  labelFormatter={label => toNiceDateYear(label)}
                  labelStyle={{ paddingTop: 4 }}
                  contentStyle={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    borderColor: chartColor,
                    color: 'black'
                  }}
                  wrapperStyle={{ top: -70, left: -10 }}
                />
                <Bar
                  type="monotone"
                  name={t('volume')}
                  dataKey="dailyVolumeUSD"
                  fill={chartColor}
                  yAxisId={0}
                  stroke={chartColor}
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
