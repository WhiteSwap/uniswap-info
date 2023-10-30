import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useMedia, useToggle } from 'react-use'
import { PageWrapper, FullWrapper } from 'components'
import { ButtonLight } from 'components/ButtonStyled'
import { Row, RowBetween } from 'components/Row'
import Search from 'components/Search'
import { Title } from 'components/Title/styled'
import TopTokenList from 'components/TokenList'
import { SupportedNetwork } from 'constants/networks'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { useTokens } from 'state/features/token/selectors'
import { TokenDetails } from 'state/features/token/types'
import { TYPE, DashboardWrapper } from 'Theme'

function AllTokensPage() {
  const { t } = useTranslation()
  const activeNetwork = useActiveNetworkId()
  const isPolygon = activeNetwork === SupportedNetwork.POLYGON
  const [isAllTokens, toggleAllTokens] = useToggle(true)
  const allTokens = useTokens()
  const tokenList = useMemo(() => {
    const tokenListObject: Record<string, TokenDetails> = {}
    allTokens
      ? Object.values(allTokens).forEach(token => {
          if (token.isTokenList) tokenListObject[token.id] = token
        })
      : {}
    return tokenListObject
  }, [allTokens])
  const below600 = useMedia('(max-width: 800px)')

  return (
    <PageWrapper>
      <FullWrapper>
        <DashboardWrapper>
          <RowBetween>
            <Row>
              <TYPE.largeHeader>{isAllTokens ? 'All Tokens' : 'Tokenlist'}</TYPE.largeHeader>
              <ButtonLight marginLeft="1rem" onClick={() => toggleAllTokens(!isAllTokens)}>
                {isAllTokens ? 'Show Tokenlist' : 'Show All Tokens'}
              </ButtonLight>
            </Row>
            {!below600 && <Search />}
          </RowBetween>
          {isPolygon ? (
            <Title marginTop="5rem">{t('comingSoon')}</Title>
          ) : (
            <TopTokenList tokens={isAllTokens ? allTokens : tokenList} itemMax={50} />
          )}
        </DashboardWrapper>
      </FullWrapper>
    </PageWrapper>
  )
}

export default AllTokensPage
