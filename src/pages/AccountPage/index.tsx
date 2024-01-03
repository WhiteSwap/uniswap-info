import { useState, useMemo, useRef, useEffect } from 'react'
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
import { useUserPositions, useUserTransactions } from 'state/features/account/hooks'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { useToggleSavedAccount } from 'state/features/user/hooks'
import { DashboardWrapper, TYPE } from 'Theme'
import { ellipsisAddress, formattedNumber, getExplorerLink, isValidAddress } from 'utils'
import { calculateDayFees } from 'utils/pair'
import { DropdownWrapper, Flyout, Header, MenuRow, ActionsContainer } from './styled'

function AccountPage() {
  const { t } = useTranslation()
  const formatPath = useFormatPath()
  const activeNetworkId = useActiveNetworkId()
  const { accountAddress } = useParams()

  const address = activeNetworkId === 'tron' ? accountAddress : accountAddress?.toLowerCase()

  if (!address || !isValidAddress(address, activeNetworkId)) {
    return <Navigate to={formatPath('/')} />
  }

  const below600 = useMedia('(max-width: 600px)')
  const below440 = useMedia('(max-width: 440px)')

  const [isSaved, toggleSavedAccount] = useToggleSavedAccount(address)
  const positions = useUserPositions(address)
  const transactions = useUserTransactions(address)

  const totalTransactionsAmount = useMemo(
    () => (transactions ? transactions.swaps.length + transactions.burns.length + transactions.mints.length : 0),
    [transactions]
  )
  const totalSwappedUSD = useMemo(
    () => transactions?.swaps.reduce((total, swap) => total + swap.amountUSD, 0),
    [transactions?.swaps?.length, transactions]
  )
  const totalFeesPaid = useMemo(() => calculateDayFees(totalSwappedUSD), [totalSwappedUSD])

  // settings for list view and dropdowns
  const hideLPContent = positions && positions.length === 0
  const [showDropdown, setShowDropdown] = useState(false)
  const [activePosition, setActivePosition] = useState<Position | undefined>()
  const dynamicPositions = activePosition ? [activePosition] : positions

  const filteredTransactions = useMemo(() => {
    if (!transactions || !activePosition) {
      return null
    }

    const { tokenOne, tokenTwo } = activePosition

    const isMatchingTransaction = (trans: { tokenOne: any; tokenTwo: any }): any => {
      const { tokenOne: transTokenOne, tokenTwo: transTokenTwo } = trans
      return (
        (transTokenOne.id === tokenOne.id && transTokenTwo.id === tokenTwo.id) ||
        (transTokenOne.id === tokenTwo.id && transTokenTwo.id === tokenOne.id)
      )
    }
    const filteredData: Partial<Transactions> = {}

    if (transactions.burns.some(trans => isMatchingTransaction(trans))) {
      filteredData.burns = transactions.burns.filter(trans => isMatchingTransaction(trans))
    }

    if (transactions.mints && transactions.mints.some(trans => isMatchingTransaction(trans))) {
      filteredData.mints = transactions.mints.filter(trans => isMatchingTransaction(trans))
    }

    if (transactions.swaps.some(trans => isMatchingTransaction(trans))) {
      filteredData.swaps = transactions.swaps.filter(trans => isMatchingTransaction(trans))
    }
    return filteredData as Transactions
  }, [transactions, activePosition])

  const positionStatistics = useMemo(
    () =>
      dynamicPositions?.reduce(
        (accumulator, position) => {
          accumulator.feesEarnedCumulative += position.earningFeeTotalUsd
          accumulator.liquidityIncludingFees += position.totalUsd
          return accumulator
        },
        { feesEarnedCumulative: 0, liquidityIncludingFees: 0 }
      ),
    [dynamicPositions]
  )
  const node = useRef(null)
  useOnClickOutside(node, showDropdown ? () => setShowDropdown(false) : undefined)

  useEffect(() => {
    if (activePosition && positions && accountAddress && !positions.includes(activePosition)) {
      setActivePosition(undefined)
    }

    return () => setActivePosition(undefined)
  }, [accountAddress])

  return (
    <PageWrapper>
      <ContentWrapperLarge>
        <RowBetween>
          <TYPE.body>
            <BasicLink to={formatPath('/accounts')}>{`${t('accounts')} `}</BasicLink>→
            <Link href={getExplorerLink(activeNetworkId, address, 'address')} target="_blank">
              {ellipsisAddress(address)}
            </Link>
          </TYPE.body>
          {!below600 && <Search />}
        </RowBetween>
        <Header>
          <RowBetween>
            {below600 ? (
              <TYPE.header fontSize={24}>{ellipsisAddress(address)}</TYPE.header>
            ) : (
              <TYPE.header fontSize={24}>{address}</TYPE.header>
            )}
            <ActionsContainer>
              <StarIcon $filled={isSaved} onClick={toggleSavedAccount} />
              <a
                href={getExplorerLink(activeNetworkId, address, 'address')}
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
                  <TYPE.header fontSize={24}>{totalFeesPaid ? formattedNumber(totalFeesPaid, true) : '-'}</TYPE.header>
                  <TYPE.main>{t('totalFeesPaid')}</TYPE.main>
                </AutoColumn>
                <AutoColumn gap="8px">
                  <TYPE.header fontSize={24}>{totalTransactionsAmount ?? '-'}</TYPE.header>
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
                  <TYPE.header fontSize={24}>{totalTransactionsAmount ?? '-'}</TYPE.header>
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
                    {positionStatistics?.liquidityIncludingFees
                      ? formattedNumber(positionStatistics.liquidityIncludingFees, true)
                      : positionStatistics?.liquidityIncludingFees === 0
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
                  <TYPE.header
                    fontSize={below440 ? 18 : 24}
                    lineHeight={1}
                    color={positionStatistics?.feesEarnedCumulative && 'green'}
                  >
                    {positionStatistics?.feesEarnedCumulative
                      ? formattedNumber(positionStatistics.feesEarnedCumulative, true)
                      : '-'}
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
                <PairReturnsChart account={address} position={activePosition} />
              ) : (
                <UserChart account={address} />
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
          {filteredTransactions ? (
            <TransactionTable transactions={filteredTransactions} />
          ) : transactions ? (
            <TransactionTable transactions={transactions} />
          ) : (
            <LocalLoader />
          )}
        </DashboardWrapper>
      </ContentWrapperLarge>
    </PageWrapper>
  )
}

export default AccountPage
