import { useState, useEffect, useRef } from 'react'
import { createChart, CrosshairMode } from 'lightweight-charts'
import dayjs from 'dayjs'
import { formattedNumber } from '../../utils'
import { usePrevious } from 'react-use'
import styled from 'styled-components/macro'
import { Play } from 'react-feather'
import { useDarkModeManager } from 'state/features/user/hooks'

const IconWrapper = styled.div`
  position: absolute;
  right: 10px;
  color: ${({ theme }) => theme.text1};
  border-radius: 3px;
  height: 16px;
  width: 16px;
  padding: 0px;
  bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const CandleStickChart = ({
  data,
  width,
  height = 300,
  base,
  margin = true,
  valueFormatter = value => formattedNumber(value, true)
}) => {
  // reference for DOM element to create with chart
  const ref = useRef()

  const formattedData = data?.map(entry => {
    return {
      time: Number.parseFloat(entry.timestamp),
      open: Number.parseFloat(entry.open),
      low: Number.parseFloat(entry.open),
      close: Number.parseFloat(entry.close),
      high: Number.parseFloat(entry.close)
    }
  })

  if (formattedData && formattedData.length > 0) {
    formattedData.push({
      time: dayjs().unix(),
      open: Number.parseFloat(formattedData[formattedData.length - 1].close),
      close: Number.parseFloat(base),
      low: Math.min(Number.parseFloat(base), Number.parseFloat(formattedData[formattedData.length - 1].close)),
      high: Math.max(Number.parseFloat(base), Number.parseFloat(formattedData[formattedData.length - 1].close))
    })
  }

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState(false)
  const dataPrevious = usePrevious(data)

  const [darkMode] = useDarkModeManager()
  const textColor = darkMode ? 'white' : 'black'
  const previousTheme = usePrevious(darkMode)

  // reset the chart if theme switches
  useEffect(() => {
    if (chartCreated && previousTheme !== darkMode) {
      // remove the tooltip element
      // eslint-disable-next-line sonarjs/no-duplicate-string
      let tooltip = document.getElementById('tooltip-id')
      tooltip.remove()
      chartCreated.resize(0, 0)
      setChartCreated()
    }
  }, [chartCreated, darkMode, previousTheme])

  useEffect(() => {
    if (data !== dataPrevious && chartCreated) {
      // remove the tooltip element
      let tooltip = document.getElementById('tooltip-id')
      tooltip.remove()
      chartCreated.resize(0, 0)
      setChartCreated()
    }
  }, [chartCreated, data, dataPrevious])

  // if no chart created yet, create one with options and add to DOM manually
  useEffect(() => {
    if (!chartCreated) {
      const chart = createChart(ref.current, {
        width: width,
        height: height,
        layout: {
          backgroundColor: 'transparent',
          textColor: textColor
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
          priceFormatter: value => formattedNumber(value)
        }
      })

      var candleSeries = chart.addCandlestickSeries({
        upColor: 'green',
        downColor: 'red',
        borderDownColor: 'red',
        borderUpColor: 'green',
        wickDownColor: 'red',
        wickUpColor: 'green'
      })

      candleSeries.setData(formattedData)

      var toolTip = document.createElement('div')
      toolTip.setAttribute('id', 'tooltip-id')
      toolTip.className = 'three-line-legend'
      ref.current.append(toolTip)
      toolTip.style.display = 'block'
      toolTip.style.left = (margin ? 174 : 10) + 'px'
      toolTip.style.top = 64 + 'px'
      toolTip.style.backgroundColor = 'transparent'
      toolTip.style.width = '50%'

      // get the title of the chart
      const setLastBarText = () => {
        toolTip.innerHTML = base
          ? `<div style="font-size: 22px; margin: 4px 0px; color: ${textColor}">` + valueFormatter(base) + '</div>'
          : ''
      }
      setLastBarText()

      // update the title when hovering on the chart
      chart.subscribeCrosshairMove(function (parameter) {
        if (
          parameter === undefined ||
          parameter.time === undefined ||
          parameter.point.x < 0 ||
          parameter.point.x > width ||
          parameter.point.y < 0 ||
          parameter.point.y > height
        ) {
          setLastBarText()
        } else {
          var price = parameter.seriesPrices.get(candleSeries).close
          const time = dayjs.unix(parameter.time).format('MM/DD h:mm A')
          toolTip.innerHTML =
            `<div style="font-size: 22px; margin: 4px 0px; color: ${textColor}">` +
            valueFormatter(price) +
            `<span style="font-size: 12px; margin: 4px 6px; color: ${textColor}">` +
            time +
            ' UTC' +
            '</span>' +
            '</div>'
        }
      })

      chart.timeScale().fitContent()

      setChartCreated(chart)
    }
  }, [chartCreated, formattedData, width, height, valueFormatter, base, margin, textColor])

  // responsiveness
  useEffect(() => {
    if (width) {
      chartCreated && chartCreated.resize(width, height)
      chartCreated && chartCreated.timeScale().scrollToPosition(0)
    }
  }, [chartCreated, height, width])

  return (
    <div>
      <div ref={ref} id="test-id" />
      <IconWrapper>
        <Play
          onClick={() => {
            chartCreated && chartCreated.timeScale().fitContent()
          }}
        />
      </IconWrapper>
    </div>
  )
}

export default CandleStickChart
