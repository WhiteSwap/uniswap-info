import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import { XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid } from 'recharts'
import { OptionButton } from 'components/ButtonStyled'
import DropdownSelect from 'components/DropdownSelect'
import LocalLoader from 'components/LocalLoader'
import { AutoRow, RowBetween } from 'components/Row'
import { timeframeOptions } from 'constants/index'
import { useColor } from 'hooks'
import { useUserPositionChart } from 'state/features/account/hooks'
import { useDarkModeManager } from 'state/features/user/hooks'
import { toK, toNiceDate, toNiceDateYear, formattedNumber, getTimeframe } from 'utils'
import { ChartWrapper, OptionsRow } from './styled'

const CHART_VIEW = {
  VALUE: 'Value',
  FEES: 'Fees'
}

interface IPairReturnsChart {
  account: string
  position: Position
}

const PairReturnsChart = ({ account, position }: IPairReturnsChart) => {
  const { t } = useTranslation()
  const below600 = useMedia('(max-width: 600px)')
  const aspect = below600 ? 60 / 42 : 60 / 16
  const color = useColor(position.tokenOne.id)
  const [darkMode] = useDarkModeManager()
  const textColor = darkMode ? 'white' : 'black'

  const [chartView, setChartView] = useState(CHART_VIEW.VALUE)
  const [chartTimeFrame, setChartTimeFrame] = useState(timeframeOptions.YEAR)
  const data = useUserPositionChart(position, account, chartTimeFrame)

  // based on window, get starttime
  const utcStartTime = getTimeframe(chartTimeFrame)
  const filteredData = data?.filter(entry => entry.date >= utcStartTime)

  const changeTimeFrame = (timeFrame: string) => {
    return () => {
      setChartTimeFrame(timeFrame)
    }
  }

  return (
    <ChartWrapper>
      {below600 ? (
        <RowBetween mb={40}>
          <div />
          <DropdownSelect
            options={timeframeOptions}
            active={chartTimeFrame}
            setActive={setChartTimeFrame}
            color={color}
          />
        </RowBetween>
      ) : (
        <OptionsRow>
          <AutoRow gap="6px" style={{ flexWrap: 'nowrap' }}>
            <OptionButton active={chartView === CHART_VIEW.VALUE} onClick={() => setChartView(CHART_VIEW.VALUE)}>
              {t('liquidity')}
            </OptionButton>
            <OptionButton active={chartView === CHART_VIEW.FEES} onClick={() => setChartView(CHART_VIEW.FEES)}>
              {t('fees')}
            </OptionButton>
          </AutoRow>
          <AutoRow justify="flex-end" gap="6px">
            <OptionButton
              active={chartTimeFrame === timeframeOptions.WEEK}
              onClick={changeTimeFrame(timeframeOptions.WEEK)}
            >
              1W
            </OptionButton>
            <OptionButton
              active={chartTimeFrame === timeframeOptions.MONTH}
              onClick={changeTimeFrame(timeframeOptions.MONTH)}
            >
              1M
            </OptionButton>
            <OptionButton
              active={chartTimeFrame === timeframeOptions.YEAR}
              onClick={changeTimeFrame(timeframeOptions.YEAR)}
            >
              1Y
            </OptionButton>
          </AutoRow>
        </OptionsRow>
      )}
      <ResponsiveContainer aspect={aspect}>
        {filteredData ? (
          <LineChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barCategoryGap={1} data={filteredData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={14}
              tickFormatter={tick => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: textColor }}
              type={'number'}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              type="number"
              orientation="right"
              tickFormatter={tick => '$' + toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={0}
              yAxisId={0}
              tick={{ fill: textColor }}
            />
            <Tooltip
              cursor={true}
              formatter={(value: string | number | undefined) => formattedNumber(value, true)}
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

            <Line
              type="monotone"
              dataKey={chartView === CHART_VIEW.VALUE ? 'totalLiquidityUsd' : 'fees'}
              stroke={color}
              yAxisId={0}
              name={chartView === CHART_VIEW.VALUE ? t('liquidity') : t('feesEarnedCumulative')}
            />
          </LineChart>
        ) : (
          <LocalLoader />
        )}
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

export default PairReturnsChart
