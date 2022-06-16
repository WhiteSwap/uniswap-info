import { useState, useEffect, useRef, useMemo } from 'react'
import { createChart, CrosshairMode, CandlestickData, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts'
import dayjs from 'dayjs'
import { formattedNum } from 'utils'
import { Play } from 'react-feather'
import { ChartWrapper, TooltipPrice, TimeSpan, IconWrapper } from './styled'
import { useTheme } from 'styled-components'

type Props = {
  data: TimeWindowItem[]
  width?: number
  height?: number
  base: number
  margin?: boolean
  valueFormatter?: (val?: string | number) => string | number
}

type TooltipDataType = { price: string; time: string }

const CandleStickChart = ({
  data,
  height = 300,
  base,
  // margin = true,
  valueFormatter = val => formattedNum(val)
}: Props) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi>()
  const candlestickRef = useRef<ISeriesApi<'Candlestick'>>()

  const [tooltipData, setTooltipData] = useState<TooltipDataType | undefined>()
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
      mappedData.push({
        time: dayjs().unix() as UTCTimestamp,
        open: mappedData[mappedData.length - 1].close,
        high: Math.max(base, mappedData[mappedData.length - 1].close),
        low: Math.min(base, mappedData[mappedData.length - 1].close),
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
        borderColor: 'rgba(197, 203, 206, 0.8)'
      },
      localization: {
        priceFormatter: (val?: string | number) => formattedNum(val)
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
    candlestickRef.current.setData(formattedData)

    // FIXME: replace any to MouseEventParams and try to get close value
    const handleCrosshairMove = (param: any) => {
      if (param.time && param.point?.x > 0 && param.point?.x < width && param.point?.y > 0 && param.point?.y < height) {
        const price = valueFormatter(param.seriesPrices.get(candlestickRef.current!)?.close).toString()
        const time = dayjs.utc(new Date(param.time * 1000).toUTCString()).format('MM/DD/YYYY HH:mm UTC')
        setTooltipData({ price, time })
      } else {
        setTooltipData(undefined)
      }
    }

    const handleResize = () => {
      chartRef.current?.timeScale().fitContent()
      chartRef.current?.applyOptions({ width: chartContainerRef.current?.clientWidth })
    }

    chartRef.current.subscribeCrosshairMove(handleCrosshairMove)
    window.addEventListener('resize', handleResize)
    chartRef.current.timeScale().fitContent()

    return () => {
      chartRef.current?.unsubscribeCrosshairMove(handleCrosshairMove)
      window.addEventListener('resize', handleResize)
      chartRef.current?.remove()
    }
  }, [])

  useEffect(() => {
    candlestickRef.current?.setData(formattedData)
    chartRef.current?.timeScale().scrollToPosition(0, true)
    chartRef.current?.timeScale().fitContent()
  }, [formattedData.length])

  return (
    <ChartWrapper>
      <div ref={chartContainerRef}>
        <TooltipPrice>
          ${tooltipData?.price ? tooltipData.price : valueFormatter(base)}
          {tooltipData?.time ? <TimeSpan>{tooltipData.time}</TimeSpan> : null}
        </TooltipPrice>
      </div>
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

export default CandleStickChart
