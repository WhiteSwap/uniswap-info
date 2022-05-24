import { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import LocalLoader from 'components/LocalLoader'
import { Flex } from 'rebass'
import { useFormatPath } from 'hooks'
import { CustomLink } from 'components/Link'
import { Divider } from 'components'
import { formattedNum } from 'utils'
import { TYPE } from 'Theme'
import DoubleTokenLogo from 'components/DoubleLogo'
import { RowFixed } from 'components/Row'
import Panel from 'components/Panel'
import { useTranslation } from 'react-i18next'
import { Arrow, CustomText, DashGrid, DataText, List, ListWrapper, PageButtons } from './styled'

type Props = {
  lps: LiquidityPosition[]
  maxItems: number
}

function LPList({ lps, maxItems = 10 }: Props) {
  const { t } = useTranslation()
  const formatPath = useFormatPath()
  const below440 = useMedia('(max-width: 440px)')
  const below600 = useMedia('(max-width: 600px)')
  const below800 = useMedia('(max-width: 800px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [lps])

  useEffect(() => {
    if (lps) {
      let extraPages = 1
      if (Object.keys(lps).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(lps).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, lps])

  const ListItem = ({ lp, index }: { lp: LiquidityPosition; index: number }) => {
    return (
      <DashGrid>
        {!below600 && <DataText>{index}</DataText>}
        <DataText justifyContent="flex-start">
          <CustomLink to={formatPath(`/accounts/${lp.userId}`)}>
            {below800
              ? lp.userId.slice(0, 4) + '...' + (below440 ? lp.userId.slice(39, 42) : lp.userId.slice(38, 42))
              : lp.userId}
          </CustomLink>
        </DataText>
        <DataText>
          <CustomLink to={formatPath(`/pairs/${lp.pairAddress}`)}>
            <RowFixed style={{ textAlign: 'right' }}>
              {!below600 && <DoubleTokenLogo a0={lp.tokenOne} a1={lp.tokenTwo} size={16} margin={true} />}
              {lp.pairName}
            </RowFixed>
          </CustomLink>
        </DataText>
        <DataText>{formattedNum(lp.usd, true)}</DataText>
      </DashGrid>
    )
  }

  const lpList =
    lps &&
    lps.slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE).map((lp: LiquidityPosition, index: number) => {
      return (
        <div key={index}>
          <ListItem key={index} index={(page - 1) * 10 + index + 1} lp={lp} />
          <Divider />
        </div>
      )
    })

  return (
    <ListWrapper>
      <Panel
        style={{
          marginTop: below440 ? '.75rem' : '1.5rem',
          padding: 0
        }}
      >
        <DashGrid style={{ height: 'fit-content', padding: below440 ? '.75rem' : '1rem 2rem', borderTop: 'none' }}>
          {!below600 && (
            <Flex alignItems="center" justifyContent="flex-start">
              <CustomText>#</CustomText>
            </Flex>
          )}
          <Flex alignItems="center" justifyContent="flex-start">
            <CustomText>{t('account')}</CustomText>
          </Flex>
          <Flex alignItems="center" justifyContent="flexEnd">
            <CustomText>{t('pair')}</CustomText>
          </Flex>
          <Flex alignItems="center" justifyContent="flexEnd">
            <CustomText>{t('value')}</CustomText>
          </Flex>
        </DashGrid>
        <Divider />
        <List p={0}>{!lpList ? <LocalLoader /> : lpList}</List>
      </Panel>
      <PageButtons>
        <div onClick={() => setPage(page === 1 ? page : page - 1)}>
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{`${t('page')} ${page} ${t('of')} ${maxPage}`}</TYPE.body>
        <div onClick={() => setPage(page === maxPage ? page : page + 1)}>
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </ListWrapper>
  )
}

export default LPList
