import { useState, useMemo, useRef } from 'react'
import { useUserTransactions, useUserPositions } from 'state/features/account/hooks'
import { useParams, Navigate } from 'react-router-dom'
import Panel from 'components/Panel'
import { formattedNum, getBlockChainScanLink, isValidAddress } from 'utils'
import { AutoRow, RowFixed, RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import UserChart from 'components/UserChart'
import PairReturnsChart from 'components/PairReturnsChart'
import PositionList from 'components/PositionList'
import { useFormatPath } from 'hooks'
import { DashboardWrapper, TYPE } from 'Theme'
import { ButtonDropdown } from 'components/ButtonStyled'
import { PageWrapper, StyledIcon, StarIcon, ExternalLinkIcon, ContentWrapperLarge } from 'components'
import DoubleTokenLogo from 'components/DoubleLogo'
import { Activity } from 'react-feather'
import Link from 'components/Link'
import { BasicLink } from 'components/Link'
import { useMedia } from 'react-use'
import Search from 'components/Search'
import { useTranslation } from 'react-i18next'
import { DropdownWrapper, Flyout, Header, MenuRow, ActionsContainer } from './styled'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { TransactionTable } from 'components/TransactionTable'
import LocalLoader from 'components/LocalLoader'
import { useToggleSavedAccount } from 'state/features/user/hooks'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'

function AccountPage() {
  const { t } = useTranslation()
  const formatPath = useFormatPath()
  const activeNetworkId = useActiveNetworkId()

  const { accountAddress } = useParams()
  if (!accountAddress || !isValidAddress(accountAddress, activeNetworkId)) {
    return <Navigate to={formatPath('/')} />
  }

  const [isSaved, toggleSavedAccount] = useToggleSavedAccount(accountAddress)

  const below600 = useMedia('(max-width: 600px)')
  const below440 = useMedia('(max-width: 440px)')

  // get data for this account
  const transactions = useUserTransactions(accountAddress)
  const positions = useUserPositions(accountAddress)

  // get data for user stats
  const transactionCount = transactions?.swaps?.length + transactions?.burns?.length + transactions?.mints?.length

  // get derived totals
  const totalSwappedUSD = useMemo(() => {
    return transactions?.swaps
      ? transactions?.swaps.reduce((total, swap) => {
          return total + swap.amountUSD
        }, 0)
      : 0
  }, [transactions])

  // settings for list view and dropdowns
  const hideLPContent = positions && positions.length === 0
  const [showDropdown, setShowDropdown] = useState(false)
  const [activePosition, setActivePosition] = useState<Position | undefined>()

  const dynamicPositions = activePosition ? [activePosition] : positions

  const aggregateFees = dynamicPositions?.reduce(function (total, position) {
    return total + position.feeEarned
  }, 0)

  const positionValue = useMemo(() => {
    return dynamicPositions
      ? dynamicPositions.reduce((total, position) => {
          const calcPos =
            position?.pair && position.pair.trackedReserveUSD
              ? (parseFloat(position.liquidityTokenBalance) / position.pair.totalSupply) *
                position.pair.trackedReserveUSD
              : 0

          return total + calcPos
        }, 0)
      : null
  }, [dynamicPositions])

  const node = useRef(null)
  useOnClickOutside(node, showDropdown ? () => setShowDropdown(false) : undefined)

  return (
    <PageWrapper>
      <ContentWrapperLarge>
        <RowBetween>
          <TYPE.body>
            <BasicLink to={formatPath('/accounts')}>{`${t('accounts')} `}</BasicLink>→
            <Link href={getBlockChainScanLink(activeNetworkId, accountAddress, 'address')} target="_blank">
              {accountAddress.slice(0, 6) + '...' + accountAddress.slice(38, 42)}
            </Link>
          </TYPE.body>
          {!below600 && <Search small={true} />}
        </RowBetween>
        <Header>
          <RowBetween>
            <TYPE.header fontSize={24}>
              {accountAddress?.slice(0, 6) + '...' + accountAddress?.slice(38, 42)}
            </TYPE.header>
            <ActionsContainer>
              <StarIcon filled={isSaved} onClick={toggleSavedAccount} />
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
                  <DoubleTokenLogo
                    a0={activePosition.pair.tokenOne.id}
                    a1={activePosition.pair.tokenTwo.id}
                    size={16}
                  />
                  <TYPE.body ml={'16px'}>
                    {activePosition.pair.tokenOne.symbol}-{activePosition.pair.tokenTwo.symbol} {t('position')}
                  </TYPE.body>
                </RowFixed>
              )}
            </ButtonDropdown>
            {showDropdown && (
              <Flyout>
                <AutoColumn gap="0px">
                  {positions?.map((p, i) => {
                    let tokenOneSymbol = p.pair.tokenOne.symbol
                    let tokenTwoSymbol = p.pair.tokenTwo.symbol
                    if (tokenOneSymbol === 'WETH') {
                      tokenOneSymbol = 'ETH'
                    }
                    if (tokenTwoSymbol === 'WETH') {
                      tokenTwoSymbol = 'ETH'
                    }
                    return (
                      p.pair.id !== activePosition?.pair.id && (
                        <MenuRow
                          onClick={() => {
                            setActivePosition(p)
                            setShowDropdown(false)
                          }}
                          key={i}
                        >
                          <DoubleTokenLogo a0={p.pair.tokenOne.id} a1={p.pair.tokenTwo.id} size={16} />
                          <TYPE.body ml={'16px'}>
                            {tokenOneSymbol}-{tokenTwoSymbol} {t('position')}
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
                  <TYPE.header fontSize={24}>{totalSwappedUSD ? formattedNum(totalSwappedUSD, true) : '-'}</TYPE.header>
                  <TYPE.main>{t('totalValueSwapped')}</TYPE.main>
                </AutoColumn>
                <AutoColumn gap="8px">
                  <TYPE.header fontSize={24}>
                    {totalSwappedUSD ? formattedNum(totalSwappedUSD * 0.003, true) : '-'}
                  </TYPE.header>
                  <TYPE.main>Total Fees Paid</TYPE.main>
                </AutoColumn>
                <AutoColumn gap="8px">
                  <TYPE.header fontSize={24}>{transactionCount ? transactionCount : '-'}</TYPE.header>
                  <TYPE.main>{t('totalTransactions')}</TYPE.main>
                </AutoColumn>
              </AutoColumn>
            )}
            {!below440 && (
              <AutoRow gap="20px">
                <AutoColumn gap="8px">
                  <TYPE.header fontSize={24}>{totalSwappedUSD ? formattedNum(totalSwappedUSD, true) : '-'}</TYPE.header>
                  <TYPE.main>{t('totalValueSwapped')}</TYPE.main>
                </AutoColumn>
                <AutoColumn gap="8px">
                  <TYPE.header fontSize={24}>
                    {totalSwappedUSD ? formattedNum(totalSwappedUSD * 0.003, true) : '-'}
                  </TYPE.header>
                  <TYPE.main>{t('totalFeesPaid')}</TYPE.main>
                </AutoColumn>
                <AutoColumn gap="8px">
                  <TYPE.header fontSize={24}>{transactionCount ? transactionCount : '-'}</TYPE.header>
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
                    {positionValue
                      ? formattedNum(positionValue, true)
                      : positionValue === 0
                      ? formattedNum(0, true)
                      : '-'}
                  </TYPE.header>
                </RowFixed>
              </AutoColumn>
              <AutoColumn gap="10px">
                <RowBetween>
                  <TYPE.light fontSize={below440 ? 12 : 14} fontWeight={500}>
                    {t('feesEarnedCumulative')}
                  </TYPE.light>
                  <div />
                </RowBetween>
                <RowFixed align="flex-end">
                  <TYPE.header fontSize={below440 ? 18 : 24} lineHeight={1} color={aggregateFees && 'green'}>
                    {aggregateFees ? formattedNum(aggregateFees, true) : '-'}
                  </TYPE.header>
                </RowFixed>
              </AutoColumn>
            </AutoRow>
          </DashboardWrapper>
        )}
        {!hideLPContent && (
          <DashboardWrapper style={{ display: 'grid' }}>
            <Panel style={{ width: '100%' }}>
              {activePosition ? (
                <PairReturnsChart account={accountAddress} position={activePosition} />
              ) : (
                <UserChart account={accountAddress} />
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
