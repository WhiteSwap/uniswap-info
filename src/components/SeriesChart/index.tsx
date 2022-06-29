import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { createChart, IChartApi, ISeriesApi, MouseEventParams, SeriesType, SingleValueData } from 'lightweight-charts'
import { Play } from 'react-feather'
import { useTheme } from 'styled-components'
import { IconWrapper } from 'components'
import Percent from 'components/Percent'
import { EthereumNetworkInfo, SupportedNetwork, TronNetworkInfo } from 'constants/networks'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { useAppSelector } from 'state/hooks'
import { formattedNumber } from 'utils'
import { Wrapper, ChartInfo, Title, ChartInfoPrice, ChartInfoDate } from './styled'

interface ISeriesChart {
  data: SingleValueData[]
  type: SeriesType
  base: number
  baseChange: number | null
  title: string
}

type CurrentDayData = {
  price: string
  date: string
}

const chartColors = {
  [SupportedNetwork.ETHEREUM]: {
    area: {
      topColor: EthereumNetworkInfo.primaryColor,
      bottomColor: 'rgba(41, 116, 255, 0.28)'
    },
    histogram: {
      color: EthereumNetworkInfo.primaryColor,
      baseLineColor: EthereumNetworkInfo.primaryColor
    }
  },
  [SupportedNetwork.TRON]: {
    area: {
      topColor: TronNetworkInfo.primaryColor,
      bottomColor: 'rgba(241, 50, 60, 0.157)'
    },
    histogram: {
      color: TronNetworkInfo.primaryColor,
      baseLineColor: TronNetworkInfo.primaryColor
    }
  }
}

export const SeriesChart = ({ data, type, base, baseChange, title }: ISeriesChart) => {
  const theme = useTheme()
  const darkMode = useAppSelector(state => state.user.darkMode)
  const activeNetwork = useActiveNetworkId()
  const chartContainerReference = useRef<HTMLDivElement>(null)
  const chartReference = useRef<IChartApi>()
  const seriesReference = useRef<ISeriesApi<'Area' | 'Histogram'>>()
  const [currentDayData, setCurrentDayData] = useState<CurrentDayData | undefined>()
  const textColor = darkMode ? 'rgb(165, 172, 183)' : '#45484D'

  useEffect(() => {
    const width = chartContainerReference.current!.clientWidth
    const height = 300
    chartReference.current = createChart(chartContainerReference.current!, {
      width,
      height,
      layout: {
        backgroundColor: 'transparent',
        textColor: textColor
      },
      rightPriceScale: {
        scaleMargins: {
          top: type === 'Area' ? 0.32 : 0.2,
          bottom: 0.08
        },
        borderVisible: false
      },
      timeScale: {
        borderVisible: false
      },
      grid: {
        horzLines: {
          color: 'rgba(197, 203, 206, 0.5)',
          visible: false
        },
        vertLines: {
          color: 'rgba(197, 203, 206, 0.5)',
          visible: false
        }
      },
      crosshair: {
        horzLine: {
          visible: false,
          labelVisible: false
        },
        vertLine: {
          visible: true,
          style: 0,
          width: 2,
          labelVisible: false
        }
      },
      localization: {
        priceFormatter: (value: number) => formattedNumber(value, true)
      }
    })
    const chart = chartReference.current

    switch (type) {
      case 'Area':
        seriesReference.current = chart.addAreaSeries({
          topColor: chartColors[activeNetwork].area.topColor,
          bottomColor: chartColors[activeNetwork].area.bottomColor,
          lineColor: chartColors[activeNetwork].area.topColor,
          crosshairMarkerBorderColor: 'white',
          lineWidth: 2
        })
        break
      case 'Histogram':
      default:
        seriesReference.current = chart.addHistogramSeries({
          color: chartColors[activeNetwork].histogram.color,
          priceFormat: {
            type: 'volume'
          },
          scaleMargins: {
            top: 0.32,
            bottom: 0
          },
          baseLineColor: chartColors[activeNetwork].histogram.color,
          baseLineWidth: 2
        })
        break
    }
    seriesReference.current.setData(data)

    const chartScrollCallback = (parameter: MouseEventParams) => {
      if (parameter.time) {
        const dateString =
          typeof parameter.time === 'object'
            ? dayjs(parameter.time.year + '-' + parameter.time.month + '-' + parameter.time.day).format('MMMM D, YYYY')
            : ''
        const price = parameter.seriesPrices.get(seriesReference.current!)?.toString()
        setCurrentDayData({
          price: formattedNumber(price, true).toString(),
          date: dateString
        })
      } else {
        setCurrentDayData(undefined)
      }
    }

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerReference.current!.clientWidth })
    }

    chartReference.current?.subscribeCrosshairMove(chartScrollCallback)
    window.addEventListener('resize', handleResize)
    chart.timeScale().fitContent()

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.unsubscribeCrosshairMove(chartScrollCallback)
      chart.remove()
    }
  }, [])

  useEffect(() => {
    if (seriesReference.current && chartReference.current) {
      seriesReference.current.setData(data)
      chartReference.current.timeScale().fitContent()
    }
  }, [data])

  useEffect(() => {
    chartReference.current?.applyOptions({
      layout: {
        textColor
      },
      crosshair: {
        vertLine: {
          color: theme.text4
        }
      }
    })
    switch (type) {
      case 'Area':
        seriesReference.current?.applyOptions({
          topColor: chartColors[activeNetwork].area.topColor,
          bottomColor: chartColors[activeNetwork].area.bottomColor,
          lineColor: chartColors[activeNetwork].area.topColor
        })
        break
      case 'Histogram':
      default:
        seriesReference.current?.applyOptions({
          color: chartColors[activeNetwork].histogram.color,
          baseLineColor: chartColors[activeNetwork].histogram.color
        })
        break
    }
  }, [darkMode, activeNetwork])

  return (
    <Wrapper>
      <div ref={chartContainerReference}>
        <ChartInfo>
          <Title>{type === 'Histogram' ? `${title}(24h)` : title}</Title>
          {currentDayData ? (
            <>
              <ChartInfoPrice>{currentDayData.price}</ChartInfoPrice>
              <ChartInfoDate>{currentDayData.date}</ChartInfoDate>
            </>
          ) : (
            <div>
              <ChartInfoPrice>{formattedNumber(base ?? 0, true)}</ChartInfoPrice>{' '}
              {baseChange !== null ? <Percent percent={baseChange} /> : undefined}
            </div>
          )}
        </ChartInfo>
      </div>
      <IconWrapper>
        <Play
          onClick={() => {
            chartReference.current?.timeScale().fitContent()
          }}
        />
      </IconWrapper>
    </Wrapper>
  )
}
