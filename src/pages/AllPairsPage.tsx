import { useMemo } from 'react'
import { useMedia, useToggle } from 'react-use'
import type { PairDetails } from 'state/features/pairs/types'
import { PageWrapper, FullWrapper } from 'components'
import { ButtonLight } from 'components/ButtonStyled'
import PairList from 'components/PairList'
import { Row, RowBetween } from 'components/Row'
import Search from 'components/Search'
import { usePairs } from 'state/features/pairs/selectors'
import { TYPE, DashboardWrapper } from 'Theme'

function AllPairsPage() {
  const [isAllPairs, toggleAllPairs] = useToggle(true)
  const allPairs = usePairs()
  const farmingPools = useMemo(() => {
    const farmingPoolsObject: Record<string, PairDetails> = {}
    allPairs
      ? Object.values(allPairs).forEach(pair => {
          if (pair.isFarming) farmingPoolsObject[pair.id] = pair
        })
      : {}
    return farmingPoolsObject
  }, [allPairs])

  const below800 = useMedia('(max-width: 800px)')

  return (
    <PageWrapper>
      <FullWrapper>
        <DashboardWrapper>
          <RowBetween>
            <Row>
              <TYPE.largeHeader>{isAllPairs ? 'All Pairs' : 'Farming Pools'}</TYPE.largeHeader>
              <ButtonLight marginLeft="1rem" onClick={() => toggleAllPairs(!isAllPairs)}>
                {isAllPairs ? 'Show Farming Pools' : 'Show All Pairs'}
              </ButtonLight>
            </Row>

            {!below800 && <Search />}
          </RowBetween>
          <PairList pairs={isAllPairs ? allPairs : farmingPools} maxItems={50} />
        </DashboardWrapper>
      </FullWrapper>
    </PageWrapper>
  )
}

export default AllPairsPage
