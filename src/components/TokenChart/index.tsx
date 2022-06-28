import { useState, useEffect } from 'react'
import { Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, BarChart, Bar } from 'recharts'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import { toK, toNiceDate, toNiceDateYear, formattedNumber, getTimeframe } from 'utils'
import { OptionButton } from 'components/ButtonStyled'
import { useMedia, usePrevious } from 'react-use'
import { timeframeOptions } from 'constants/index'
import { useTokenChartData, useTokenPriceData } from 'state/features/token/hooks'
import DropdownSelect from 'components/DropdownSelect'
import CandleStickChart from 'components/CandleChart'
import LocalLoader from 'components/LocalLoader'
import { Activity } from 'react-feather'
import { useDarkModeManager } from 'state/features/user/hooks'
import { useTranslation } from 'react-i18next'
import { ChartButtonsGrid, ChartWrapper, PriceOption } from './styled'

const CHART_VIEW = {
  VOLUME: 'Volume',
  LIQUIDITY: 'Liquidity',
  PRICE: 'Price',
  LINE_PRICE: 'Price (Line)'
}

const DATA_FREQUENCY = {
  DAY: 'DAY',
  HOUR: 'HOUR',
  LINE: 'LINE'
}

interface TokenChartProperties {
  address: string
  color: string
  base: number
}

const TokenChart = ({ address, color, base }: TokenChartProperties) => {
  const { t } = useTranslation()

  const [darkMode] = useDarkModeManager()
  const textColor = darkMode ? 'white' : 'black'
  const below1080 = useMedia('(max-width: 1080px)')
  const below600 = useMedia('(max-width: 600px)')

  const [chartFilter, setChartFilter] = useState(CHART_VIEW.PRICE)
  const [frequency, setFrequency] = useState(DATA_FREQUENCY.HOUR)

  const addressPrevious = usePrevious(address)

  useEffect(() => {
    if (address !== addressPrevious && addressPrevious) {
      setChartFilter(CHART_VIEW.LIQUIDITY)
    }
  }, [address, addressPrevious])

  const chartData = useTokenChartData(address)

  const [timeWindow, setTimeWindow] = useState(timeframeOptions.WEEK)

  const interval = frequency === DATA_FREQUENCY.DAY ? 86_400 : 3600
  const priceData = useTokenPriceData(address, timeWindow, interval)

  const utcStartTime = getTimeframe(timeWindow)

  const domain = ([dataMin, dataMax]: [number, number], allowDataOverflow: boolean): [number, number] => [
    +dataMin > utcStartTime && allowDataOverflow ? dataMin : utcStartTime,
    dataMax
  ]
  const aspect = below1080 ? 60 / 32 : below600 ? 60 / 42 : 60 / 22

  const filteredChartData = chartData?.filter(entry => entry.date >= utcStartTime)

  return (
    <ChartWrapper>
      {below600 ? (
        <RowBetween mb={40}>
          <DropdownSelect options={CHART_VIEW} active={chartFilter} setActive={setChartFilter} color={color} />
          <DropdownSelect options={timeframeOptions} active={timeWindow} setActive={setTimeWindow} color={color} />
        </RowBetween>
      ) : (
        <ChartButtonsGrid>
          <RowFixed>
            <OptionButton
              active={chartFilter === CHART_VIEW.LIQUIDITY}
              onClick={() => setChartFilter(CHART_VIEW.LIQUIDITY)}
              style={{ marginRight: '6px' }}
            >
              {t('liquidity')}
            </OptionButton>
            <OptionButton
              active={chartFilter === CHART_VIEW.VOLUME}
              onClick={() => setChartFilter(CHART_VIEW.VOLUME)}
              style={{ marginRight: '6px' }}
            >
              {t('volume')}
            </OptionButton>
            <OptionButton
              active={chartFilter === CHART_VIEW.PRICE}
              onClick={() => {
                setChartFilter(CHART_VIEW.PRICE)
              }}
            >
              {t('price')}
            </OptionButton>
          </RowFixed>
          <AutoRow justify="flex-end" gap="6px">
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
              1Y
            </OptionButton>
          </AutoRow>
          {chartFilter === CHART_VIEW.PRICE && (
            <AutoRow gap="4px">
              <PriceOption active={frequency === DATA_FREQUENCY.DAY} onClick={() => setFrequency(DATA_FREQUENCY.DAY)}>
                D
              </PriceOption>
              <PriceOption active={frequency === DATA_FREQUENCY.HOUR} onClick={() => setFrequency(DATA_FREQUENCY.HOUR)}>
                H
              </PriceOption>
              <PriceOption active={frequency === DATA_FREQUENCY.LINE} onClick={() => setFrequency(DATA_FREQUENCY.LINE)}>
                <Activity size={14} />
              </PriceOption>
            </AutoRow>
          )}
        </ChartButtonsGrid>
      )}
      {chartFilter === CHART_VIEW.LIQUIDITY && filteredChartData && (
        <ResponsiveContainer aspect={aspect}>
          <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap="1" data={filteredChartData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity="0.35" />
                <stop offset="95%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={16}
              minTickGap={120}
              tickFormatter={tick => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: textColor }}
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
              tick={{ fill: textColor }}
            />
            <Tooltip
              cursor={true}
              formatter={(value: string | number) => formattedNumber(value, true)}
              labelFormatter={label => toNiceDateYear(label)}
              labelStyle={{
                paddingTop: 4
              }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 10,
                borderColor: color
              }}
              wrapperStyle={{ top: '-70px', left: '-10px' }}
            />
            <Area
              key="other"
              dataKey="totalLiquidityUSD"
              stackId="2"
              strokeWidth={1}
              dot={false}
              type="monotone"
              name={t('liquidity')}
              yAxisId={0}
              stroke={color}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
      {chartFilter === CHART_VIEW.PRICE &&
        (frequency === DATA_FREQUENCY.LINE ? (
          <ResponsiveContainer aspect={below1080 ? 60 / 32 : 60 / 16}>
            <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={filteredChartData}>
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
                tickMargin={16}
                minTickGap={120}
                tickFormatter={tick => toNiceDate(tick)}
                dataKey="date"
                tick={{ fill: textColor }}
                type="number"
                allowDataOverflow
                domain={domain}
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
                tick={{ fill: textColor }}
              />
              <Tooltip
                cursor={true}
                formatter={(value: string | number) => formattedNumber(value, true)}
                labelFormatter={label => toNiceDateYear(label)}
                labelStyle={{ paddingTop: 4 }}
                contentStyle={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  borderColor: color,
                  color: 'black'
                }}
                wrapperStyle={{ top: '-70px', left: '-10px' }}
              />
              <Area
                key="other"
                dataKey="priceUSD"
                stackId="2"
                strokeWidth={2}
                dot={false}
                type="monotone"
                name={t('price')}
                yAxisId={0}
                stroke={color}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : priceData ? (
          <CandleStickChart data={priceData} base={base} />
        ) : (
          <LocalLoader />
        ))}

      {chartFilter === CHART_VIEW.VOLUME && (
        <ResponsiveContainer aspect={aspect}>
          <BarChart margin={{ top: 0, right: 10, bottom: 6, left: 10 }} barCategoryGap={1} data={filteredChartData}>
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
              formatter={(value: string | number) => formattedNumber(value, true)}
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
            <Bar type="monotone" name={t('volume')} dataKey="dailyVolumeUSD" fill={color} yAxisId={0} stroke={color} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartWrapper>
  )
}

export default TokenChart
