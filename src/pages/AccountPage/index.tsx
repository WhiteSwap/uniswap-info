import { useState, useMemo, useRef } from 'react'
import { Activity } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useParams, Navigate } from 'react-router-dom'
import { useMedia } from 'react-use'
import { PageWrapper, StyledIcon, StarIcon, ExternalLinkIcon, ContentWrapperLarge } from 'components'
import { ButtonDropdown } from 'components/ButtonStyled'
import { AutoColumn } from 'components/Column'
import DoubleTokenLogo from 'components/DoubleLogo'
import Link, { BasicLink } from 'components/Link'
import LocalLoader from 'components/LocalLoader'
import PairReturnsChart from 'components/PairReturnsChart'
import Panel from 'components/Panel'
import PositionList from 'components/PositionList'
import { AutoRow, RowFixed, RowBetween } from 'components/Row'
import Search from 'components/Search'
import { TransactionTable } from 'components/TransactionTable'
import UserChart from 'components/UserChart'
import { useFormatPath } from 'hooks'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { useUserPositions, useUserSnapshots, useUserTransactions } from 'state/features/account/hooks'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { useToggleSavedAccount } from 'state/features/user/hooks'
import { DashboardWrapper, TYPE } from 'Theme'
import { ellipsisAddress, formattedNumber, getBlockChainScanLink, isValidAddress } from 'utils'
import { calculateDayFees } from 'utils/pair'
import { DropdownWrapper, Flyout, Header, MenuRow, ActionsContainer } from './styled'

function AccountPage() {
  const { t } = useTranslation()
  const formatPath = useFormatPath()
  const activeNetworkId = useActiveNetworkId()

  const { accountAddress } = useParams()
  if (!accountAddress || !isValidAddress(accountAddress, activeNetworkId)) {
    return <Navigate to={formatPath('/')} />
  }

  const below600 = useMedia('(max-width: 600px)')
  const below440 = useMedia('(max-width: 440px)')

  const [isSaved, toggleSavedAccount] = useToggleSavedAccount(accountAddress)
  const liquiditySnapshots = useUserSnapshots(accountAddress)
  const positions = useUserPositions(accountAddress, liquiditySnapshots)
  const transactions = useUserTransactions(accountAddress)
  const totalTransactionsAmount = useMemo(
    () => (transactions ? transactions.swaps.length + transactions.burns.length + transactions.mints.length : 0),
    [transactions]
  )
  const totalSwappedUSD = transactions?.swaps.reduce((total, swap) => total + swap.amountUSD, 0)
  const totalFeesPaid = calculateDayFees(totalSwappedUSD)

  // settings for list view and dropdowns
  const hideLPContent = positions && positions.length === 0
  const [showDropdown, setShowDropdown] = useState(false)
  const [activePosition, setActivePosition] = useState<Position | undefined>()

  const dynamicPositions = activePosition ? [activePosition] : positions
  const feesEarnedCumulative = dynamicPositions?.reduce((total, position) => total + position.totalFeeUsd, 0)
  const liquidityIncludingFees = dynamicPositions?.reduce((total, position) => total + position.totalUsd, 0)

  const node = useRef(null)
  useOnClickOutside(node, showDropdown ? () => setShowDropdown(false) : undefined)

  return (
    <PageWrapper>
      <ContentWrapperLarge>
        <RowBetween>
          <TYPE.body>
            <BasicLink to={formatPath('/accounts')}>{`${t('accounts')} `}</BasicLink>→
            <Link href={getBlockChainScanLink(activeNetworkId, accountAddress, 'address')} target="_blank">
              {ellipsisAddress(accountAddress)}
            </Link>
          </TYPE.body>
          {!below600 && <Search />}
        </RowBetween>
        <Header>
          <RowBetween>
            <TYPE.header fontSize={24}>{ellipsisAddress(accountAddress)}</TYPE.header>
            <ActionsContainer>
              <StarIcon $filled={isSaved} onClick={toggleSavedAccount} />
              <a
                href={getBlockChainScanLink(activeNetworkId, accountAddress, 'address')}
                target="_blank"
                rel="noopener nofollow noreferrer"
              >
                <ExternalLinkIcon />
              </a>
            </ActionsContainer>
          </RowBetween>
        </Header>
        {!hideLPContent && (
          <DropdownWrapper ref={node}>
            <ButtonDropdown width="100%" onClick={() => setShowDropdown(!showDropdown)} open={showDropdown}>
              {!activePosition && (
                <RowFixed>
                  <StyledIcon>
                    <Activity size={16} />
                  </StyledIcon>
                  <TYPE.body ml={'10px'}>{t('allPositions')}</TYPE.body>
                </RowFixed>
              )}
              {activePosition && (
                <RowFixed>
                  <DoubleTokenLogo a0={activePosition.tokenOne?.id} a1={activePosition.tokenTwo?.id} size={16} />
                  <TYPE.body ml={'16px'}>
                    {activePosition.tokenOne?.symbol}-{activePosition.tokenTwo?.symbol} {t('position')}
                  </TYPE.body>
                </RowFixed>
              )}
            </ButtonDropdown>
            {showDropdown && (
              <Flyout>
                <AutoColumn gap="0px">
                  {positions?.map((p, index) => {
                    return (
                      p.pairAddress !== activePosition?.pairAddress && (
                        <MenuRow
                          onClick={() => {
                            setActivePosition(p)
                            setShowDropdown(false)
                          }}
                          key={index}
                        >
                          <DoubleTokenLogo a0={p.tokenOne?.id} a1={p.tokenTwo?.id} size={16} />
                          <TYPE.body ml={'16px'}>
                            {p.tokenOne?.symbol}-{p.tokenTwo?.symbol} {t('position')}
                          </TYPE.body>
                        </MenuRow>
                      )
                    )
                  })}
                  {activePosition && (
                    <MenuRow
                      onClick={() => {
                        setActivePosition(undefined)
                        setShowDropdown(false)
                      }}
                    >
                      <RowFixed>
                        <StyledIcon>
                          <Activity size={16} />
                        </StyledIcon>
                        <TYPE.body ml={'10px'}>{t('allPositions')}</TYPE.body>
                      </RowFixed>
                    </MenuRow>
                  )}
                </AutoColumn>
              </Flyout>
            )}
          </DropdownWrapper>
        )}
        <DashboardWrapper>
          <TYPE.main fontSize={22} fontWeight={500}>
            {t('walletStats')}
          </TYPE.main>
          <Panel
            style={{
              marginTop: below440 ? '.75rem' : '1.5rem'
            }}
          >
            {below440 && (
              <AutoColumn gap=".75rem">
                <AutoColumn gap="8px">
                  <TYPE.header fontSize={24}>
                    {totalSwappedUSD ? formattedNumber(totalSwappedUSD, true) : '-'}
                  </TYPE.header>
                  <TYPE.main>{t('totalValueSwapped')}</TYPE.main>
                </AutoColumn>
                <AutoColumn gap="8px">
                  <TYPE.header fontSize={24}>
                    {totalSwappedUSD ? formattedNumber(totalFeesPaid, true) : '-'}
                  </TYPE.header>
                  <TYPE.main>{t('totalFeesPaid')}</TYPE.main>
                </AutoColumn>
                <AutoColumn gap="8px">
                  <TYPE.header fontSize={24}>{totalTransactionsAmount ? totalTransactionsAmount : '-'}</TYPE.header>
                  <TYPE.main>{t('totalTransactions')}</TYPE.main>
                </AutoColumn>
              </AutoColumn>
            )}
            {!below440 && (
              <AutoRow gap="1.25rem">
                <AutoColumn gap="8px">
                  <TYPE.header fontSize={24}>
                    {totalSwappedUSD ? formattedNumber(totalSwappedUSD, true) : '-'}
                  </TYPE.header>
                  <TYPE.main>{t('totalValueSwapped')}</TYPE.main>
                </AutoColumn>
                <AutoColumn gap="8px">
                  <TYPE.header fontSize={24}>{totalFeesPaid ? formattedNumber(totalFeesPaid, true) : '-'}</TYPE.header>
                  <TYPE.main>{t('totalFeesPaid')}</TYPE.main>
                </AutoColumn>
                <AutoColumn gap="8px">
                  <TYPE.header fontSize={24}>{totalTransactionsAmount ? totalTransactionsAmount : '-'}</TYPE.header>
                  <TYPE.main>{t('totalTransactions')}</TYPE.main>
                </AutoColumn>
              </AutoRow>
            )}
          </Panel>
        </DashboardWrapper>
        {!hideLPContent && (
          <DashboardWrapper>
            <AutoRow gap="1.5rem">
              <AutoColumn gap="10px">
                <RowBetween>
                  <TYPE.light fontSize={below440 ? 12 : 14} fontWeight={500}>
                    {t('liquidityIncludingFees')}
                  </TYPE.light>
                  <div />
                </RowBetween>
                <RowFixed>
                  <TYPE.header fontSize={below440 ? 18 : 24} lineHeight={1}>
                    {liquidityIncludingFees
                      ? formattedNumber(liquidityIncludingFees, true)
                      : liquidityIncludingFees === 0
                      ? formattedNumber(0, true)
                      : '-'}
                  </TYPE.header>
                </RowFixed>
              </AutoColumn>
              <AutoColumn gap="10px">
                <RowBetween>
                  <TYPE.light fontSize={below440 ? 12 : 14} fontWeight={500}>
                    {t('feesEarnedCumulative')}
                  </TYPE.light>
                </RowBetween>
                <RowFixed align="flex-end">
                  <TYPE.header fontSize={below440 ? 18 : 24} lineHeight={1} color={feesEarnedCumulative && 'green'}>
                    {feesEarnedCumulative ? formattedNumber(feesEarnedCumulative, true) : '-'}
                  </TYPE.header>
                </RowFixed>
              </AutoColumn>
            </AutoRow>
          </DashboardWrapper>
        )}
        {!hideLPContent && (
          <DashboardWrapper style={{ display: 'grid' }}>
            <Panel>
              {activePosition ? (
                <PairReturnsChart
                  account={accountAddress}
                  position={activePosition}
                  liquiditySnapshots={liquiditySnapshots}
                />
              ) : (
                <UserChart account={accountAddress} liquiditySnapshots={liquiditySnapshots} />
              )}
            </Panel>
          </DashboardWrapper>
        )}

        <DashboardWrapper>
          <TYPE.main fontSize={22} fontWeight={500}>
            {t('positions')}
          </TYPE.main>
          <PositionList positions={positions} />
        </DashboardWrapper>

        <DashboardWrapper>
          <TYPE.main fontSize={22} fontWeight={500}>
            {t('transactions')}
          </TYPE.main>
          {transactions ? <TransactionTable transactions={transactions} /> : <LocalLoader />}
        </DashboardWrapper>
      </ContentWrapperLarge>
    </PageWrapper>
  )
}

export default AccountPage
