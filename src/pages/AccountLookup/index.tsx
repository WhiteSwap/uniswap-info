import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import { PageWrapper, FullWrapper } from 'components'
import AccountSearch from 'components/AccountSearch'
import LocalLoader from 'components/LocalLoader'
import LPList from 'components/LPList'
import { RowBetween } from 'components/Row'
import Search from 'components/Search'
import { useTopLiquidityPositions } from 'state/features/account/hooks'
import { DashboardWrapper, TYPE } from 'Theme'
import { AccountWrapper } from './styled'

function AccountLookup() {
  const { t } = useTranslation()

  const topLps = useTopLiquidityPositions()

  const below600 = useMedia('(max-width: 600px)')

  return (
    <PageWrapper>
      <FullWrapper>
        <DashboardWrapper>
          <RowBetween>
            <TYPE.largeHeader>{t('walletAnalytics')}</TYPE.largeHeader>
            {!below600 && <Search />}
          </RowBetween>
          <AccountWrapper>
            <AccountSearch />
          </AccountWrapper>
        </DashboardWrapper>

        <DashboardWrapper>
          <TYPE.main fontSize={22} fontWeight={500}>
            {t('topLiquidityPositions')}
          </TYPE.main>
          {topLps && topLps.length > 0 ? <LPList lps={topLps} maxItems={200} /> : <LocalLoader />}
        </DashboardWrapper>
      </FullWrapper>
    </PageWrapper>
  )
}

export default AccountLookup
