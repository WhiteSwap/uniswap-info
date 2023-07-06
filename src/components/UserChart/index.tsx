import { useState } from 'react'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import { Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart } from 'recharts'
import styled from 'styled-components/macro'
import { OptionButton } from 'components/ButtonStyled'
import DropdownSelect from 'components/DropdownSelect'
import LocalLoader from 'components/LocalLoader'
import { AutoRow, RowBetween } from 'components/Row'
import { timeframeOptions } from 'constants/index'
import { useUserLiquidityChart } from 'state/features/account/hooks'
import { useDarkModeManager } from 'state/features/user/hooks'
import { TYPE } from 'Theme'
import { toK, toNiceDate, toNiceDateYear, formattedNumber } from 'utils'

const ChartWrapper = styled.div`
  height: 100%;
  max-height: 390px;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`

interface IUserChart {
  account: string
  liquiditySnapshots?: LiquiditySnapshot[]
}

const UserChart = ({ account, liquiditySnapshots }: IUserChart) => {
  const { t } = useTranslation()
  const below600 = useMedia('(max-width: 600px)')
  const above1600 = useMedia('(min-width: 1600px)')
  const [darkMode] = useDarkModeManager()
  const [timeWindow, setTimeWindow] = useState(timeframeOptions.YEAR)
  const chartData = useUserLiquidityChart(account, timeWindow, liquiditySnapshots)
  const textColor = darkMode ? 'white' : 'black'
  const aspect = above1600 ? 60 / 12 : below600 ? 60 / 42 : 60 / 16

  return (
    <ChartWrapper>
      {below600 ? (
        <RowBetween mb={40}>
          <div />
          <DropdownSelect options={timeframeOptions} active={timeWindow} setActive={setTimeWindow} color={'#C9A02F'} />
        </RowBetween>
      ) : (
        <RowBetween mb={40}>
          <AutoRow gap="10px">
            <TYPE.main>{t('liquidityValue')}</TYPE.main>
          </AutoRow>
          <AutoRow justify="flex-end" gap="4px">
            <OptionButton
              active={timeWindow === timeframeOptions.MONTH}
              onClick={() => setTimeWindow(timeframeOptions.MONTH)}
            >
              1M
            </OptionButton>
            <OptionButton
              active={timeWindow === timeframeOptions.WEEK}
              onClick={() => setTimeWindow(timeframeOptions.WEEK)}
            >
              1W
            </OptionButton>
            <OptionButton
              active={timeWindow === timeframeOptions.YEAR}
              onClick={() => setTimeWindow(timeframeOptions.YEAR)}
            >
              1Y
            </OptionButton>
          </AutoRow>
        </RowBetween>
      )}
      {chartData ? (
        <ResponsiveContainer aspect={aspect}>
          <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={chartData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={'#2E69BB'} stopOpacity={0.35} />
                <stop offset="95%" stopColor={'#2E69BB'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={16}
              minTickGap={0}
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
              minTickGap={6}
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
                borderColor: '#C9A02F',
                color: 'black'
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Area
              key="other"
              dataKey="value"
              stackId="2"
              strokeWidth={1}
              dot={false}
              type="monotone"
              name={t('liquidity')}
              yAxisId={0}
              stroke={darken(0.12, '#2E69BB')}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <LocalLoader />
      )}
    </ChartWrapper>
  )
}

export default UserChart
