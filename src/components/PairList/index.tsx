import { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import LocalLoader from 'components/LocalLoader'
import { Flex } from 'rebass'
import { useFormatPath } from 'hooks'
import { formattedNumber } from 'utils'
import DoubleTokenLogo from 'components/DoubleLogo'
import FormattedName from 'components/FormattedName'
import QuestionHelper from 'components/QuestionHelper'
import { TYPE } from 'Theme'
import Panel from 'components/Panel'
import { useTranslation } from 'react-i18next'
import Percent from 'components/Percent'
import { DashGrid, DataText, ClickableText, PageButtons, List, Link, PaginationButton } from './styled'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Divider } from 'components'

enum PairSortField {
  Apy = 'Apy',
  Liquidity = 'Liquidity',
  Volume = 'Volume',
  WeekVolume = 'WeekVolume',
  Fees = 'Fees'
}

interface IPairTable {
  pairs?: Record<string, Pair>
  maxItems?: number
}

function PairList({ pairs, maxItems = 10 }: IPairTable) {
  const { t } = useTranslation()
  const formatPath = useFormatPath()

  const below440 = useMedia('(max-width: 440px)')
  const below600 = useMedia('(max-width: 600px)')
  const below740 = useMedia('(max-width: 740px)')
  const below1080 = useMedia('(max-width: 1080px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(0)
  const ITEMS_PER_PAGE = maxItems

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(PairSortField.Liquidity)

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [pairs])

  useEffect(() => {
    if (pairs) {
      let extraPages = 1
      if (Object.keys(pairs).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(pairs).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, pairs])

  const ListItem = ({ pairData, index }: { pairData: Pair; index: number }) => {
    const liquidity = formattedNumber(pairData.totalLiquidityUSD, true)
    const volume = formattedNumber(pairData.dayVolumeUSD, true)

    return (
      <DashGrid style={{ padding: below440 ? '.75rem' : '.875rem 2rem' }}>
        <DataText fontWeight="500">
          {!below600 && <div style={{ marginRight: '20px', width: '10px' }}>{index}</div>}
          <DoubleTokenLogo
            size={below600 ? 16 : 20}
            a0={pairData.tokenOne.id}
            a1={pairData.tokenTwo.id}
            margin={!below740}
          />
          <Link to={formatPath(`/pairs/${pairData.id}`)}>
            <FormattedName
              text={pairData.tokenOne.symbol + '-' + pairData.tokenTwo.symbol}
              maxCharacters={below600 ? 8 : 16}
              adjustSize={true}
              link={true}
              fontSize={below440 ? 10 : 14}
            />
          </Link>
        </DataText>
        <DataText>{liquidity}</DataText>
        <DataText>{volume}</DataText>
        {!below1080 ? (
          <>
            <DataText>{formattedNumber(pairData.weekVolumeUSD, true)}</DataText>
            <DataText>{formattedNumber(pairData.dayFees, true)}</DataText>
            <DataText>
              <Percent percent={pairData.apy} />
            </DataText>
          </>
        ) : undefined}
      </DashGrid>
    )
  }

  const changeSortDirection = (direction: PairSortField) => {
    return () => {
      setSortedColumn(direction)
      setSortDirection(sortedColumn !== direction ? true : !sortDirection)
    }
  }

  const sortDirectionArrow = (column: PairSortField) => {
    const sortedSymbol = !sortDirection ? '↑' : '↓'
    return sortedColumn === column ? sortedSymbol : ''
  }

  const incrementPage = () => {
    setPage(page === 1 ? page : page - 1)
  }

  const decrementPage = () => {
    setPage(page === maxPage ? page : page + 1)
  }

  const pairList =
    pairs &&
    Object.keys(pairs).length > 0 &&
    Object.values(pairs)
      .sort((a, b) => {
        let order = false
        const direction = sortDirection ? -1 : 1
        switch (sortedColumn) {
          case PairSortField.Apy:
            order = a.apy > b.apy
            break
          case PairSortField.Fees:
            order = a.dayFees > b.dayFees
            break
          case PairSortField.Liquidity:
            order = a.totalLiquidityUSD > b.totalLiquidityUSD
            break
          case PairSortField.Volume:
            order = a.dayVolumeUSD > b.dayVolumeUSD
            break
          case PairSortField.WeekVolume:
          default:
            order = a.weekVolumeUSD > b.weekVolumeUSD
            break
        }
        return order ? direction : direction * -1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)

  return (
    <div>
      <Panel
        style={{
          marginTop: below440 ? '.75rem' : '1.5rem',
          padding: 0
        }}
      >
        <DashGrid style={{ height: 'fit-content', padding: below440 ? '.75rem' : '1rem 2rem', borderTop: 'none' }}>
          <Flex alignItems="center" justifyContent="flexStart">
            <ClickableText style={{ justifyContent: 'flex-start' }}>{t('name')}</ClickableText>
          </Flex>
          <Flex alignItems="center" justifyContent="flexEnd">
            <ClickableText onClick={changeSortDirection(PairSortField.Liquidity)}>
              {t('liquidity')} {sortDirectionArrow(PairSortField.Liquidity)}
            </ClickableText>
          </Flex>
          <Flex alignItems="center">
            <ClickableText onClick={changeSortDirection(PairSortField.Volume)}>
              {t('volume24hrs')}
              {sortDirectionArrow(PairSortField.Volume)}
            </ClickableText>
          </Flex>
          {!below1080 ? (
            <>
              <Flex alignItems="center" justifyContent="flexEnd">
                <ClickableText onClick={changeSortDirection(PairSortField.WeekVolume)}>
                  {t('volume')} (7d) {sortDirectionArrow(PairSortField.WeekVolume)}
                </ClickableText>
              </Flex>
              <Flex alignItems="center" justifyContent="flexEnd">
                <ClickableText onClick={changeSortDirection(PairSortField.Fees)}>
                  {t('fees24hrs')} {sortDirectionArrow(PairSortField.Fees)}
                </ClickableText>
              </Flex>
              <Flex alignItems="center" justifyContent="flexEnd">
                <ClickableText onClick={changeSortDirection(PairSortField.Apy)}>
                  {`1y ${t('fees')} / ${t('liquidity')} ${sortDirectionArrow(PairSortField.Apy)}`}
                </ClickableText>
                <QuestionHelper text={t('basedOn24hrVolume')} />
              </Flex>
            </>
          ) : undefined}
        </DashGrid>
        <Divider />
        <List p={0}>
          {!pairList ? (
            <LocalLoader />
          ) : (
            pairList.map(
              (pair, index) =>
                pair && <ListItem key={index} index={(page - 1) * ITEMS_PER_PAGE + index + 1} pairData={pair} />
            )
          )}
        </List>
      </Panel>
      {maxPage ? (
        <PageButtons>
          <PaginationButton type="button" disabled={page === 1} onClick={incrementPage}>
            <ArrowLeft width="1rem" height="1rem" />
          </PaginationButton>
          <TYPE.body>{`${t('page')} ${page} ${t('of')} ${maxPage}`}</TYPE.body>
          <PaginationButton type="button" disabled={page === maxPage} onClick={decrementPage}>
            <ArrowRight width="1rem" height="1rem" />
          </PaginationButton>
        </PageButtons>
      ) : undefined}
    </div>
  )
}

export default PairList
