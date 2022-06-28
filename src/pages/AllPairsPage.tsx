import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import { PageWrapper, FullWrapper } from 'components'
import PairList from 'components/PairList'
import { RowBetween } from 'components/Row'
import Search from 'components/Search'
import { usePairs } from 'state/features/pairs/selectors'
import { TYPE, DashboardWrapper } from 'Theme'

function AllPairsPage() {
  const { t } = useTranslation()
  const allPairs = usePairs()

  const below800 = useMedia('(max-width: 800px)')

  return (
    <PageWrapper>
      <FullWrapper>
        <DashboardWrapper>
          <RowBetween>
            <TYPE.largeHeader>{t('topPairs')}</TYPE.largeHeader>
            {!below800 && <Search />}
          </RowBetween>
          <PairList pairs={allPairs} maxItems={50} />
        </DashboardWrapper>
      </FullWrapper>
    </PageWrapper>
  )
}

export default AllPairsPage
