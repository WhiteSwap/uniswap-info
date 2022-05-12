import { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import LocalLoader from '../LocalLoader'
import { Flex } from 'rebass'
import { useFormatPath } from 'hooks'
import { Divider } from '..'
import { formattedNum } from '../../utils'
import DoubleTokenLogo from '../DoubleLogo'
import FormattedName from '../FormattedName'
import QuestionHelper from '../QuestionHelper'
import { TYPE } from '../../Theme'
import Panel from '../Panel'
import { useTranslation } from 'react-i18next'
import Percent from 'components/Percent'
import { DashGrid, DataText, ClickableText, PageButtons, Arrow, List, Link } from './styled'

enum PairSortField {
  Apy = 'Apy',
  Liquidity = 'Liquidity',
  Volume = 'Volume',
  WeekVolume = 'WeekVolume',
  Fees = 'Fees'
}

interface IPairTable {
  pairs: Record<string, Pair>
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
  const [maxPage, setMaxPage] = useState(1)
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
    const liquidity = formattedNum(pairData.totalLiquidityUSD, true)
    const volume = formattedNum(pairData.dayVolumeUSD, true)

    return (
      <DashGrid style={{ padding: below440 ? '.75rem' : '.875rem 2rem' }}>
        <DataText fontWeight="500">
          {!below600 && <div style={{ marginRight: '20px', width: '10px' }}>{index}</div>}
          {!below440 && (
            <DoubleTokenLogo
              size={below600 ? 16 : 20}
              a0={pairData.tokenOne.id}
              a1={pairData.tokenTwo.id}
              margin={!below740}
            />
          )}
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
        {!below1080 && <DataText>{formattedNum(pairData.weekVolumeUSD, true)}</DataText>}
        {!below1080 && <DataText>{formattedNum(pairData.dayFees, true)}</DataText>}
        {!below1080 && (
          <DataText>
            <Percent percent={pairData.apy} />
          </DataText>
        )}
      </DashGrid>
    )
  }

  const changeSortDirection = (direction: PairSortField) => {
    return () => {
      setSortedColumn(direction)
      setSortDirection(sortedColumn !== direction ? true : !sortDirection)
    }
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
      .map(
        (pair, index) =>
          pair && (
            <div key={index}>
              <ListItem index={(page - 1) * ITEMS_PER_PAGE + index + 1} pairData={pair} />
              <Divider />
            </div>
          )
      )

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
              {t('liquidity')} {sortedColumn === PairSortField.Liquidity ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
          <Flex alignItems="center">
            <ClickableText onClick={changeSortDirection(PairSortField.Volume)}>
              {t('volume24hrs')}
              {sortedColumn === PairSortField.Volume ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
          {!below1080 && (
            <Flex alignItems="center" justifyContent="flexEnd">
              <ClickableText onClick={changeSortDirection(PairSortField.WeekVolume)}>
                {'volume'} (7d) {sortedColumn === PairSortField.WeekVolume ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          )}
          {!below1080 && (
            <Flex alignItems="center" justifyContent="flexEnd">
              <ClickableText onClick={changeSortDirection(PairSortField.Fees)}>
                {t('fees24hrs')} {sortedColumn === PairSortField.Fees ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          )}
          {!below1080 && (
            <Flex alignItems="center" justifyContent="flexEnd">
              <ClickableText onClick={changeSortDirection(PairSortField.Apy)}>
                {`1y ${t('fees')} / ${t('liquidity')} ${
                  sortedColumn === PairSortField.Apy ? (!sortDirection ? '↑' : '↓') : ''
                }`}
              </ClickableText>
              <QuestionHelper text={t('basedOn24hrVolume')} />
            </Flex>
          )}
        </DashGrid>
        <Divider />
        <List p={0}>{!pairList ? <LocalLoader /> : pairList}</List>
      </Panel>
      <PageButtons>
        <div
          onClick={() => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{`${t('page')} ${page} ${t('of')} ${maxPage}`}</TYPE.body>
        <div
          onClick={() => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </div>
  )
}

export default PairList
