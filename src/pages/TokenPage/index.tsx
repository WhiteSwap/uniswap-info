import { useState, useEffect } from 'react'
import { useLocation, useParams, Navigate } from 'react-router-dom'
import { Text } from 'rebass'
import Link from 'components/Link'
import Panel from 'components/Panel'
import TokenLogo from 'components/TokenLogo'
import PairList from 'components/PairList'
import Loader from 'components/LocalLoader'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { ButtonLight, ButtonDark } from 'components/ButtonStyled'
import TokenChart from 'components/TokenChart'
import { BasicLink } from 'components/Link'
import Search from 'components/Search'
import { formattedNum, getPoolLink, getSwapLink, getBlockChainScanLink, isValidAddress } from 'utils'
import { useTokenData, useTokenTransactions, useTokenPairsIds, useTokenPairs } from 'state/features/token/hooks'
import { useFormatPath, useColor } from 'hooks'
import { OVERVIEW_TOKEN_BLACKLIST } from 'constants/index'
import { useMedia } from 'react-use'
import Warning from 'components/Warning'
import { usePathDismissed, useToggleSavedToken } from 'state/features/user/hooks'
import { PageWrapper, ContentWrapper, StarIcon, ExternalLinkIcon } from 'components'
import FormattedName from 'components/FormattedName'
import { useListedTokens } from 'state/features/application/hooks'
import { TYPE, DashboardWrapper } from 'Theme'
import { useTranslation } from 'react-i18next'
import { useActiveNetworkId } from 'state/features/application/selectors'
import Percent from 'components/Percent'
import { ActionsContainer, PanelWrapper, WarningGrouping } from './styled'
import { TransactionTable } from 'components/TransactionTable'
import { SupportedNetwork } from 'constants/networks'
import ComingSoon from 'components/ComingSoon'

const TokenPage = () => {
  const { t } = useTranslation()
  const { tokenAddress } = useParams()
  const location = useLocation()
  const formatPath = useFormatPath()
  const activeNetworkId = useActiveNetworkId()

  if (
    !tokenAddress ||
    OVERVIEW_TOKEN_BLACKLIST.includes(tokenAddress.toLowerCase()) ||
    !isValidAddress(tokenAddress, activeNetworkId)
  ) {
    return <Navigate to={formatPath('/')} />
  }

  const below1080 = useMedia('(max-width: 1080px)')
  const below1024 = useMedia('(max-width: 1024px)')
  const below600 = useMedia('(max-width: 600px)')
  const below440 = useMedia('(max-width: 440px)')

  const {
    id,
    name,
    symbol,
    priceUSD,
    dayVolumeUSD,
    totalLiquidityUSD,
    volumeChangeUSD,
    oneDayVolumeUT,
    volumeChangeUT,
    priceChangeUSD,
    liquidityChangeUSD,
    oneDayTxns,
    txnChange
  } = useTokenData(tokenAddress)

  // detect color from token
  const backgroundColor = useColor(id, symbol)

  const tokenPairIds = useTokenPairsIds(tokenAddress)

  // pairs to show in pair list
  const pairsList = useTokenPairs(tokenPairIds)
  // all transactions with this token
  const transactions = useTokenTransactions(tokenAddress)

  // price
  const price = priceUSD ? formattedNum(priceUSD, true) : ''

  // volume
  const volume =
    dayVolumeUSD || dayVolumeUSD === 0
      ? formattedNum(dayVolumeUSD === 0 ? oneDayVolumeUT : dayVolumeUSD, true)
      : dayVolumeUSD === 0
      ? '$0'
      : '-'

  // mark if using untracked volume
  const [usingUtVolume, setUsingUtVolume] = useState(false)

  const volumeChange = (!usingUtVolume ? volumeChangeUSD : volumeChangeUT) || 0

  // liquidity
  const liquidity = totalLiquidityUSD ? formattedNum(totalLiquidityUSD, true) : totalLiquidityUSD === 0 ? '$0' : '-'

  // format for long symbol
  const LENGTH = below1080 ? 10 : 16
  const formattedSymbol = symbol?.length > LENGTH ? symbol.slice(0, LENGTH) + '...' : symbol

  const [dismissed, markAsDismissed] = usePathDismissed(location.pathname)
  const [isTokenSaved, toggleSavedToken] = useToggleSavedToken(tokenAddress, symbol)

  const listedTokens = useListedTokens()

  useEffect(() => {
    setUsingUtVolume(dayVolumeUSD === 0 ? true : false)
  }, [dayVolumeUSD])

  return (
    <PageWrapper>
      <Warning
        show={!dismissed && listedTokens.length > 0 && !listedTokens.includes(tokenAddress)}
        setShow={markAsDismissed}
        address={tokenAddress}
      />
      <ContentWrapper>
        <RowBetween style={{ flexWrap: 'wrap', alignItems: 'center' }}>
          <AutoRow align="flex-end" style={{ width: 'fit-content' }}>
            <TYPE.body>
              <BasicLink to={formatPath(`/tokens`)}>{`${t('tokens')} `}</BasicLink>→ {symbol}
              {'  '}
            </TYPE.body>
            <Link
              style={{ width: 'fit-content' }}
              color={backgroundColor}
              external
              to={getBlockChainScanLink(activeNetworkId, tokenAddress, 'token')}
            >
              <Text style={{ marginLeft: '.15rem' }} fontSize={'14px'} fontWeight={400}>
                ({tokenAddress.slice(0, 8) + '...' + tokenAddress.slice(36, 42)})
              </Text>
            </Link>
          </AutoRow>
          {!below600 && <Search />}
        </RowBetween>

        <WarningGrouping disabled={!dismissed && listedTokens && !listedTokens.includes(tokenAddress)}>
          <DashboardWrapper style={{ marginTop: below1080 ? '0' : '1rem' }}>
            <RowBetween
              style={{
                flexWrap: 'wrap',
                marginBottom: below600 ? '1rem' : '2rem',
                alignItems: 'center'
              }}
            >
              <RowFixed style={{ flexWrap: 'wrap' }}>
                <RowFixed style={{ alignItems: 'baseline' }}>
                  <TokenLogo
                    alt={symbol}
                    address={tokenAddress}
                    size={below440 ? '22px' : '32px'}
                    style={{ alignSelf: 'center' }}
                  />
                  <TYPE.main
                    fontSize={!below1080 ? '2.5rem' : below440 ? '1.25rem' : '1.5rem'}
                    style={{ margin: '0 1rem' }}
                  >
                    <RowFixed>
                      <FormattedName text={name ? name + ' ' : ''} maxCharacters={16} style={{ marginRight: '6px' }} />{' '}
                      {formattedSymbol ? `(${formattedSymbol})` : ''}
                    </RowFixed>
                  </TYPE.main>
                  {!below1080 && (
                    <>
                      <TYPE.main fontSize={'1.5rem'} fontWeight={500} style={{ marginRight: '1rem' }}>
                        {price}
                      </TYPE.main>
                      {priceChangeUSD ? <Percent percent={priceChangeUSD} /> : ''}
                    </>
                  )}
                </RowFixed>
              </RowFixed>
              <ActionsContainer>
                <StarIcon $filled={isTokenSaved} onClick={toggleSavedToken} />
                <Link to={getPoolLink(activeNetworkId, tokenAddress, null)} target="_blank">
                  <ButtonLight color={backgroundColor}>{t('addLiquidity')}</ButtonLight>
                </Link>
                <Link to={getSwapLink(activeNetworkId, tokenAddress, null)} target="_blank">
                  <ButtonDark color={backgroundColor}>{t('trade')}</ButtonDark>
                </Link>
                <a
                  href={getBlockChainScanLink(activeNetworkId, tokenAddress, 'token')}
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                >
                  <ExternalLinkIcon />
                </a>
              </ActionsContainer>
            </RowBetween>

            <PanelWrapper>
              {below1080 && price && (
                <Panel>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>{t('price')}</TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      {' '}
                      <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                        {price}
                      </TYPE.main>
                      <TYPE.main>{priceChangeUSD ? <Percent percent={priceChangeUSD} /> : ''}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>
              )}
              <Panel>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.light fontSize={14} fontWeight={500}>
                      {t('totalLiquidity')}
                    </TYPE.light>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {liquidity}
                    </TYPE.main>
                    <TYPE.main>
                      <Percent percent={liquidityChangeUSD} />
                    </TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </Panel>
              <Panel>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.light fontSize={14} fontWeight={500}>
                      {t('volume24hrs')} {usingUtVolume && `(${t('untracked')})`}
                    </TYPE.light>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {volume}
                    </TYPE.main>
                    <TYPE.main>
                      <Percent percent={volumeChange} />
                    </TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </Panel>

              <Panel>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.light fontSize={14} fontWeight={500}>
                      {t('transactions')} (24hrs)
                    </TYPE.light>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {oneDayTxns ? oneDayTxns : '-'}
                    </TYPE.main>
                    <TYPE.main>
                      <Percent percent={txnChange} />
                    </TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </Panel>
              <Panel
                style={{
                  gridColumn: !below1080 ? '2/4' : below1024 ? '1/4' : '2/-1',
                  gridRow: below1080 ? '' : '1/4'
                }}
              >
                {activeNetworkId === SupportedNetwork.TRON ? <ComingSoon /> : undefined}
                {activeNetworkId === SupportedNetwork.ETHEREUM && priceUSD ? (
                  <TokenChart address={tokenAddress} color={backgroundColor} base={priceUSD} />
                ) : undefined}
              </Panel>
            </PanelWrapper>
          </DashboardWrapper>

          <DashboardWrapper style={{ marginTop: '1.5rem' }}>
            <TYPE.main fontSize={22} fontWeight={500}>
              {t('topPairs')}
            </TYPE.main>
            {tokenAddress && Object.keys(pairsList).length > 0 ? <PairList pairs={pairsList} /> : <Loader />}
          </DashboardWrapper>

          <DashboardWrapper style={{ marginTop: '1.5rem' }}>
            <TYPE.main fontSize={22} fontWeight={500}>
              {t('transactions')}
            </TYPE.main>
            {transactions ? <TransactionTable color={backgroundColor} transactions={transactions} /> : <Loader />}
          </DashboardWrapper>
        </WarningGrouping>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default TokenPage
