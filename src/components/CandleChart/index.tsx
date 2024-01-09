import { useEffect, useRef, useMemo, memo } from 'react'
import dayjs from 'dayjs'
import { createChart, CrosshairMode, CandlestickData, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts'
import { Play } from 'react-feather'
import { useTheme } from 'styled-components'
import { SupportedNetwork } from 'constants/networks'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { formattedNumber } from 'utils'
import { ChartWrapper, IconWrapper } from './styled'

interface CandleStickChartProperties {
  data: TimeWindowItem[]
  height?: number
  base: number
}

const CandleStickChart = ({ data, height = 300, base }: CandleStickChartProperties) => {
  // FIXME: hotfix
  const currentNetwork = useActiveNetworkId()
  const chartContainerReference = useRef<HTMLDivElement>(null)
  const chartReference = useRef<IChartApi>()
  const candlestickReference = useRef<ISeriesApi<'Candlestick'>>()

  const theme = useTheme()

  const formattedData: CandlestickData[] = useMemo(() => {
    const mappedData = data.map(entry => {
      return {
        time: Number.parseFloat(entry.timestamp) as UTCTimestamp,
        open: entry.open,
        high: entry.close,
        low: entry.open,
        close: entry.close
      }
    })

    // FIXME: chart data should not be modified in candle stick chart component
    // current modify only for ethereum chain
    if (mappedData && mappedData.length > 0 && currentNetwork === SupportedNetwork.ETHEREUM) {
      const md = mappedData.at(-1)

      md &&
        mappedData.push({
          time: dayjs().unix() as UTCTimestamp,
          open: md.close,
          high: Math.max(base, md.close),
          low: Math.min(base, md.close),
          close: base
        })
    }
    return mappedData
  }, [data.length])

  useEffect(() => {
    const width = chartContainerReference.current?.clientWidth || 300
    chartReference.current = createChart(chartContainerReference.current!, {
      width: width,
      height: height,
      layout: {
        backgroundColor: 'transparent',
        textColor: theme.text1
      },
      grid: {
        vertLines: {
          color: 'rgba(197, 203, 206, 0.5)'
        },
        horzLines: {
          color: 'rgba(197, 203, 206, 0.5)'
        }
      },
      crosshair: {
        mode: CrosshairMode.Normal
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
        visible: true
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
        timeVisible: true
      },
      localization: {
        priceFormatter: (value?: string | number) => formattedNumber(value)
      }
    })

    candlestickReference.current = chartReference.current.addCandlestickSeries({
      upColor: 'green',
      downColor: 'red',
      borderDownColor: 'red',
      borderUpColor: 'green',
      wickDownColor: 'red',
      wickUpColor: 'green'
    })

    const handleResize = () => {
      chartReference.current?.timeScale().fitContent()
      chartReference.current?.applyOptions({
        width: chartContainerReference.current?.clientWidth
      })
    }

    window.addEventListener('resize', handleResize)
    chartReference.current.timeScale().fitContent()

    return () => {
      window.removeEventListener('resize', handleResize)
      chartReference.current?.remove()
    }
  }, [])

  useEffect(() => {
    chartReference.current?.timeScale().scrollToPosition(0, false)
    candlestickReference.current?.setData(formattedData)
    chartReference.current?.timeScale().fitContent()
  }, [formattedData.length])

  return (
    <ChartWrapper>
      <div ref={chartContainerReference} />
      <IconWrapper>
        <Play
          onClick={() => {
            chartReference.current?.timeScale().fitContent()
          }}
        />
      </IconWrapper>
    </ChartWrapper>
  )
}

export default memo(CandleStickChart)
