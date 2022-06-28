import { useEffect, useRef, useMemo, memo } from 'react'
import { createChart, CrosshairMode, CandlestickData, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts'
import dayjs from 'dayjs'
import { formattedNum } from 'utils'
import { Play } from 'react-feather'
import { ChartWrapper, IconWrapper } from './styled'
import { useTheme } from 'styled-components'

type Props = {
  data: TimeWindowItem[]
  height?: number
  base: number
}

const CandleStickChart = ({ data, height = 300, base }: Props) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi>()
  const candlestickRef = useRef<ISeriesApi<'Candlestick'>>()

  const theme = useTheme()

  const formattedData: CandlestickData[] = useMemo(() => {
    const mappedData = data.map(entry => {
      return {
        time: parseFloat(entry.timestamp) as UTCTimestamp,
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
    const width = chartContainerRef.current?.clientWidth || 300
    chartRef.current = createChart(chartContainerRef.current!, {
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
        priceFormatter: (value?: string | number) => formattedNum(value)
      }
    })

    candlestickRef.current = chartRef.current.addCandlestickSeries({
      upColor: 'green',
      downColor: 'red',
      borderDownColor: 'red',
      borderUpColor: 'green',
      wickDownColor: 'red',
      wickUpColor: 'green'
    })

    const handleResize = () => {
      chartRef.current?.timeScale().fitContent()
      chartRef.current?.applyOptions({
        width: chartContainerRef.current?.clientWidth
      })
    }

    window.addEventListener('resize', handleResize)
    chartRef.current.timeScale().fitContent()

    return () => {
      window.removeEventListener('resize', handleResize)
      chartRef.current?.remove()
    }
  }, [])

  useEffect(() => {
    chartRef.current?.timeScale().scrollToPosition(0, false)
    candlestickRef.current?.setData(formattedData)
    chartRef.current?.timeScale().fitContent()
  }, [formattedData.length])

  return (
    <ChartWrapper>
      <div ref={chartContainerRef} />
      <IconWrapper>
        <Play
          onClick={() => {
            chartRef.current?.timeScale().fitContent()
          }}
        />
      </IconWrapper>
    </ChartWrapper>
  )
}

export default memo(CandleStickChart)
