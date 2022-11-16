import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Navigate, Link as RouterLink } from 'react-router-dom'
import { useMedia } from 'react-use'
import { PageWrapper, ContentWrapperLarge, StarIcon, ExternalLinkIcon } from 'components'
import { ButtonLight, ButtonDark } from 'components/ButtonStyled'
import { AutoColumn } from 'components/Column'
import DoubleTokenLogo from 'components/DoubleLogo'
import Link, { BasicLink } from 'components/Link'
import PairChart from 'components/PairChart'
import Panel from 'components/Panel'
import Percent from 'components/Percent'
import { RowBetween, RowFixed, AutoRow } from 'components/Row'
import Search from 'components/Search'
import TokenLogo from 'components/TokenLogo'
import { TransactionTable } from 'components/TransactionTable'
import { PAIR_BLACKLIST } from 'constants/index'
import { useFormatPath } from 'hooks'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { usePairData, usePairTransactions } from 'state/features/pairs/hooks'
import { useToggleSavedPair } from 'state/features/user/hooks'
import { TYPE, DashboardWrapper } from 'Theme'
import { isValidAddress, formattedNumber, getBlockChainScanLink, getExchangeLink } from 'utils'
import { WarningGrouping, TokenSymbolLink, FixedPanel, PanelWrapper, TokenLink, ActionsContainer } from './styled'

const PairPage = () => {
  const { t } = useTranslation()
  const formatPath = useFormatPath()
  const parameters = useParams()
  const pairAddress = parameters.pairAddress!
  const activeNetworkId = useActiveNetworkId()

  if (PAIR_BLACKLIST.includes(pairAddress.toLowerCase()) || !isValidAddress(pairAddress, activeNetworkId)) {
    return <Navigate to={formatPath('/')} />
  }

  const {
    tokenOne,
    tokenTwo,
    totalLiquidityUSD,
    trackedReserveUSD,
    dayFees,
    dayVolumeUSD,
    volumeChangeUSD,
    oneDayVolumeUntracked,
    volumeChangeUntracked,
    liquidityChangeUSD
  } = usePairData(pairAddress)

  const transactions = usePairTransactions(pairAddress)

  const liquidity = trackedReserveUSD
    ? formattedNumber(trackedReserveUSD, true)
    : totalLiquidityUSD
    ? formattedNumber(totalLiquidityUSD, true)
    : '$0'

  const volume =
    dayVolumeUSD || dayVolumeUSD === 0
      ? formattedNumber(dayVolumeUSD === 0 ? oneDayVolumeUntracked : dayVolumeUSD, true)
      : dayVolumeUSD === 0
      ? '$0'
      : '-'

  // mark if using untracked volume
  const [usingUtVolume, setUsingUtVolume] = useState(false)
  useEffect(() => {
    setUsingUtVolume(dayVolumeUSD === 0 ? true : false)
  }, [dayVolumeUSD])

  const volumeChange = !usingUtVolume ? volumeChangeUSD : volumeChangeUntracked

  // formatted symbols for overflow
  const formattedSymbol0 = tokenOne?.symbol.length > 6 ? tokenOne?.symbol.slice(0, 5) + '...' : tokenOne?.symbol
  const formattedSymbol1 = tokenTwo?.symbol.length > 6 ? tokenTwo?.symbol.slice(0, 5) + '...' : tokenTwo?.symbol

  const below1080 = useMedia('(max-width: 1080px)')
  const below1024 = useMedia('(max-width: 1024px)')
  const below900 = useMedia('(max-width: 900px)')
  const below600 = useMedia('(max-width: 600px)')
  const below440 = useMedia('(max-width: 440px)')

  const [isPairSaved, toggleSavedPair] = useToggleSavedPair(
    pairAddress,
    tokenOne?.id,
    tokenTwo?.id,
    tokenOne?.symbol,
    tokenTwo?.symbol
  )

  return (
    <PageWrapper>
      <ContentWrapperLarge>
        <RowBetween>
          <TYPE.body>
            <BasicLink to={formatPath('/pairs')}>{'Pairs '}</BasicLink>→ {tokenOne?.symbol}-{tokenTwo?.symbol}
          </TYPE.body>
          {!below600 && <Search />}
        </RowBetween>
        <WarningGrouping disabled={!tokenOne && !tokenTwo}>
          <DashboardWrapper>
            <AutoColumn gap="40px" style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  width: '100%'
                }}
              >
                <RowFixed style={{ flexWrap: 'wrap', minWidth: '100px' }}>
                  <RowFixed>
                    {tokenOne && tokenTwo && (
                      <DoubleTokenLogo
                        a0={tokenOne?.id || ''}
                        a1={tokenTwo?.id || ''}
                        size={below440 ? 22 : 32}
                        margin={true}
                      />
                    )}{' '}
                    <TYPE.main
                      fontSize={!below1080 ? '2.5rem' : below440 ? '1.25rem' : '1.5rem'}
                      style={{ margin: '0 1rem' }}
                    >
                      {tokenOne && tokenTwo ? (
                        <>
                          <TokenSymbolLink to={formatPath(`/tokens/${tokenOne?.id}`)}>
                            {tokenOne.symbol}
                          </TokenSymbolLink>
                          <span>/</span>
                          <TokenSymbolLink to={formatPath(`/tokens/${tokenTwo?.id}`)}>
                            {tokenTwo.symbol}
                          </TokenSymbolLink>{' '}
                          {t('pair')}
                        </>
                      ) : null}
                    </TYPE.main>
                  </RowFixed>
                </RowFixed>
                <ActionsContainer>
                  <StarIcon $filled={isPairSaved} onClick={toggleSavedPair} />
                  <Link
                    external
                    href={getExchangeLink({
                      network: activeNetworkId,
                      inputCurrency: tokenOne?.id,
                      outputCurrency: tokenTwo?.id,
                      type: 'add'
                    })}
                  >
                    <ButtonLight>{t('addLiquidity')}</ButtonLight>
                  </Link>
                  <Link
                    external
                    href={getExchangeLink({
                      network: activeNetworkId,
                      inputCurrency: tokenOne?.id,
                      outputCurrency: tokenTwo?.id,
                      type: 'swap'
                    })}
                  >
                    <ButtonDark>{t('trade')}</ButtonDark>
                  </Link>
                  <a
                    href={getBlockChainScanLink(activeNetworkId, pairAddress, 'address')}
                    target="_blank"
                    rel="noopener nofollow noreferrer"
                  >
                    <ExternalLinkIcon />
                  </a>
                </ActionsContainer>
              </div>
            </AutoColumn>
            <AutoRow
              gap="6px"
              style={{
                width: 'fit-content',
                marginTop: below900 ? '1rem' : '0',
                marginBottom: below900 ? '0' : '2rem',
                flexWrap: 'wrap'
              }}
            >
              <FixedPanel as={RouterLink} to={formatPath(`/tokens/${tokenOne?.id}`)}>
                <RowFixed>
                  <TokenLogo alt={tokenOne?.symbol} address={tokenOne?.id} size={'1rem'} />
                  <TYPE.light fontSize=".875rem" lineHeight="1rem" fontWeight={700} ml=".25rem" mr="3.75rem">
                    {tokenOne && tokenTwo
                      ? `1 ${formattedSymbol0} = ${formattedNumber(tokenOne.price) || '-'} ${formattedSymbol1} ${
                          tokenOne.priceUSD ? '(' + formattedNumber(tokenOne.priceUSD, true) + ')' : undefined
                        }`
                      : '-'}
                  </TYPE.light>
                </RowFixed>
              </FixedPanel>

              <FixedPanel as={RouterLink} to={formatPath(`/tokens/${tokenTwo?.id}`)}>
                <RowFixed>
                  <TokenLogo alt={tokenTwo?.symbol} address={tokenTwo?.id} size={'16px'} />
                  <TYPE.light fontSize={'.875rem'} lineHeight={'1rem'} fontWeight={700} ml={'.25rem'}>
                    {tokenOne && tokenTwo
                      ? `1 ${formattedSymbol1} = ${formattedNumber(tokenTwo.price) || '-'} ${formattedSymbol0}  ${
                          tokenTwo?.priceUSD ? '(' + formattedNumber(tokenTwo.priceUSD, true) + ')' : ''
                        }`
                      : '-'}
                  </TYPE.light>
                </RowFixed>
              </FixedPanel>
            </AutoRow>
            <>
              {!below1080 && <TYPE.main fontSize={'1.375rem'}>{t('pairStats')}</TYPE.main>}
              <PanelWrapper style={{ marginTop: '.875rem' }}>
                <Panel>
                  <AutoColumn gap="1.25rem">
                    <RowBetween>
                      <TYPE.light fontSize={14} fontWeight={500}>
                        {t('totalLiquidity')}
                      </TYPE.light>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main fontSize="1.5rem" lineHeight={1} fontWeight={500}>
                        {liquidity}
                      </TYPE.main>
                      <TYPE.main fontSize={12} fontWeight={500}>
                        <Percent percent={liquidityChangeUSD} />
                      </TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>
                <Panel>
                  <AutoColumn gap="1.25rem">
                    <RowBetween>
                      <TYPE.light fontSize={14} fontWeight={500}>
                        {t('volume24hrs')}
                      </TYPE.light>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main fontSize="1.5rem" lineHeight={1} fontWeight={500}>
                        {volume}
                      </TYPE.main>
                      <TYPE.main fontSize={12} fontWeight={500}>
                        <Percent percent={volumeChange || 0} />
                      </TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>
                <Panel>
                  <AutoColumn gap="1.25rem">
                    <RowBetween>
                      <TYPE.light fontSize={14} fontWeight={500}>
                        {t('fees24hrs')}
                      </TYPE.light>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main fontSize="1.5rem" lineHeight={1} fontWeight={500}>
                        {formattedNumber(dayFees, true)}
                      </TYPE.main>
                      <TYPE.main fontSize={12} fontWeight={500}>
                        <Percent percent={volumeChange || 0} />
                      </TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>

                <Panel>
                  <AutoColumn gap="1.25rem">
                    <RowBetween>
                      <TYPE.light fontSize={14} fontWeight={500}>
                        {t('pooledTokens')}
                      </TYPE.light>
                      <div />
                    </RowBetween>
                    <TokenLink to={formatPath(`/tokens/${tokenOne?.id}`)}>
                      <AutoRow gap="4px">
                        <TokenLogo alt={tokenOne?.symbol} address={tokenOne?.id} />
                        <TYPE.main fontSize={20} lineHeight={1} fontWeight={500}>
                          <RowFixed>
                            {tokenOne?.reserve ? formattedNumber(tokenOne.reserve) : ''} {tokenOne?.symbol ?? ''}
                          </RowFixed>
                        </TYPE.main>
                      </AutoRow>
                    </TokenLink>
                    <TokenLink to={formatPath(`/tokens/${tokenTwo?.id}`)}>
                      <AutoRow gap="4px">
                        <TokenLogo alt={tokenTwo?.symbol} address={tokenTwo?.id} />
                        <TYPE.main fontSize={20} lineHeight={1} fontWeight={500}>
                          <RowFixed>
                            {tokenTwo?.reserve ? formattedNumber(tokenTwo.reserve) : ''} {tokenTwo?.symbol ?? ''}
                          </RowFixed>
                        </TYPE.main>
                      </AutoRow>
                    </TokenLink>
                  </AutoColumn>
                </Panel>
                <Panel
                  style={{
                    gridColumn: !below1080 ? '2/4' : below1024 ? '1/4' : '2/-1',
                    gridRow: below1080 ? '' : '1/5',
                    width: '100%'
                  }}
                >
                  <PairChart
                    address={pairAddress}
                    color={'#2E69BB'}
                    base0={tokenTwo?.reserve / tokenOne?.reserve}
                    base1={tokenOne?.reserve / tokenTwo?.reserve}
                  />
                </Panel>
              </PanelWrapper>
            </>
          </DashboardWrapper>
          <DashboardWrapper style={{ marginTop: '1rem' }}>
            <TYPE.main fontSize={22} fontWeight={500}>
              {t('transactions')}
            </TYPE.main>{' '}
            <TransactionTable transactions={transactions} />
          </DashboardWrapper>
        </WarningGrouping>
      </ContentWrapperLarge>
    </PageWrapper>
  )
}

export default PairPage
