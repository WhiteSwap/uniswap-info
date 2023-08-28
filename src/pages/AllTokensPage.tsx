import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import { PageWrapper, FullWrapper } from 'components'
import { RowBetween } from 'components/Row'
import Search from 'components/Search'
import TopTokenList from 'components/TokenList'
import { useTokens } from 'state/features/token/selectors'
import { TYPE, DashboardWrapper } from 'Theme'

function AllTokensPage() {
  const { t } = useTranslation()
  const allTokens = useTokens()

  const below600 = useMedia('(max-width: 800px)')

  return (
    <PageWrapper>
      <FullWrapper>
        <DashboardWrapper>
          <RowBetween>
            <TYPE.largeHeader>{t('topTokens')}</TYPE.largeHeader>
            {!below600 && <Search />}
          </RowBetween>
          <TopTokenList tokens={allTokens} itemMax={50} />
        </DashboardWrapper>
      </FullWrapper>
    </PageWrapper>
  )
}

export default AllTokensPage
