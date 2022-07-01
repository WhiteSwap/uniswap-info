import { useEffect, useRef, useMemo, memo } from 'react'
import dayjs from 'dayjs'
import { createChart, CrosshairMode, CandlestickData, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts'
import { Play } from 'react-feather'
import { useTheme } from 'styled-components'
import { formattedNumber } from 'utils'
import { ChartWrapper, IconWrapper } from './styled'

interface CandleStickChartProperties {
  data: TimeWindowItem[]
  height?: number
  base: number
}

const CandleStickChart = ({ data, height = 300, base }: CandleStickChartProperties) => {
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
    if (mappedData && mappedData.length > 0) {
      const { close } = mappedData[mappedData.length - 1]

      mappedData.push({
        time: dayjs().unix() as UTCTimestamp,
        open: close,
        high: Math.max(base, close),
        low: Math.min(base, close),
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
