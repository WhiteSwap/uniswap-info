import { useMemo } from 'react'
import { AutoColumn } from 'components/Column'
import { RowFixed } from 'components/Row'
import { usePairData } from 'state/features/pairs/hooks'
import { TYPE } from 'Theme'
import { formattedNumber } from 'utils'
import { PriceCard } from './styled'

function formatPercent(rawPercent: number) {
  return rawPercent < 0.01 ? '<1%' : Number.parseFloat((rawPercent * 100).toString()).toFixed(0) + '%'
}

export default function UniPrice() {
  const daiPair = usePairData('0xfbc24cd5dea5570f1d65022009f7ad9f7d3f8ade')
  const usdcPair = usePairData('0xac3b98cb04a320c71a9929dffefe558daf217a79')
  const usdtPair = usePairData('0xa029a744b4e44e22f68a1bb9a848caafbf6bb233')

  const totalLiquidity = useMemo(() => {
    return daiPair.trackedReserveUSD && usdcPair.trackedReserveUSD && usdtPair.trackedReserveUSD
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
            {daiPair && totalLiquidity ? formatPercent(daiPair.trackedReserveUSD || 0 / totalLiquidity) : '-'}
          </TYPE.light>
        </RowFixed>
        <RowFixed>
          <TYPE.main>USDC/ETH: {usdcPerEth}</TYPE.main>
          <TYPE.light style={{ marginLeft: '10px' }}>
            {usdcPair && totalLiquidity ? formatPercent(usdcPair.trackedReserveUSD || 0 / totalLiquidity) : '-'}
          </TYPE.light>
        </RowFixed>
        <RowFixed>
          <TYPE.main>USDT/ETH: {usdtPerEth}</TYPE.main>
          <TYPE.light style={{ marginLeft: '10px' }}>
            {usdtPair && totalLiquidity ? formatPercent(usdtPair.trackedReserveUSD || 0 / totalLiquidity) : '-'}
          </TYPE.light>
        </RowFixed>
      </AutoColumn>
    </PriceCard>
  )
}
