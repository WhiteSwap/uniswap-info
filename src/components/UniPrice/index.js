import { useMemo } from 'react'
import styled from 'styled-components/macro'
import Panel from '../Panel'
import { AutoColumn } from '../Column'
import { RowFixed } from '../Row'
import { TYPE } from '../../Theme'
import { usePairData } from 'state/features/pairs/hooks'
import { formattedNumber } from '../../utils'

const PriceCard = styled(Panel)`
  position: absolute;
  right: -220px;
  width: 220px;
  top: -20px;
  z-index: 9999;
  height: fit-content;
  background-color: ${({ theme }) => theme.bg1};
`

function formatPercent(rawPercent) {
  return rawPercent < 0.01 ? '<1%' : Number.parseFloat(rawPercent * 100).toFixed(0) + '%'
}

export default function UniPrice() {
  const daiPair = usePairData('0xfbc24cd5dea5570f1d65022009f7ad9f7d3f8ade')
  const usdcPair = usePairData('0xac3b98cb04a320c71a9929dffefe558daf217a79')
  const usdtPair = usePairData('0xa029a744b4e44e22f68a1bb9a848caafbf6bb233')

  const totalLiquidity = useMemo(() => {
    return daiPair && usdcPair && usdtPair
      ? daiPair.trackedReserveUSD + usdcPair.trackedReserveUSD + usdtPair.trackedReserveUSD
      : 0
  }, [daiPair, usdcPair, usdtPair])

  const daiPerEth = daiPair?.tokenTwo ? formattedNumber(daiPair.tokenTwo.priceUSD.toFixed(2), true) : '-'
  const usdcPerEth = usdcPair?.tokenTwo ? formattedNumber(usdcPair.tokenTwo.priceUSD.toFixed(2), true) : '-'
  const usdtPerEth = usdtPair?.tokenOne ? formattedNumber(usdtPair.tokenOne.priceUSD.toFixed(2), true) : '-'

  return (
    <PriceCard>
      <AutoColumn gap="10px">
        <RowFixed>
          <TYPE.main>DAI/ETH: {daiPerEth}</TYPE.main>
          <TYPE.light style={{ marginLeft: '10px' }}>
            {daiPair && totalLiquidity ? formatPercent(daiPair.trackedReserveUSD / totalLiquidity) : '-'}
          </TYPE.light>
        </RowFixed>
        <RowFixed>
          <TYPE.main>USDC/ETH: {usdcPerEth}</TYPE.main>
          <TYPE.light style={{ marginLeft: '10px' }}>
            {usdcPair && totalLiquidity ? formatPercent(usdcPair.trackedReserveUSD / totalLiquidity) : '-'}
          </TYPE.light>
        </RowFixed>
        <RowFixed>
          <TYPE.main>USDT/ETH: {usdtPerEth}</TYPE.main>
          <TYPE.light style={{ marginLeft: '10px' }}>
            {usdtPair && totalLiquidity ? formatPercent(usdtPair.trackedReserveUSD / totalLiquidity) : '-'}
          </TYPE.light>
        </RowFixed>
      </AutoColumn>
    </PriceCard>
  )
}
