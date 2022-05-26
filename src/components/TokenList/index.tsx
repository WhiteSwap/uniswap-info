import { useState, useEffect, useMemo } from 'react'
import { Flex } from 'rebass'
import TokenLogo from '../TokenLogo'
import { CustomLink } from '../Link'
import Row from '../Row'
import { Divider } from '..'

import { formattedNum } from '../../utils'
import { useFormatPath } from 'hooks'
import { useMedia } from 'react-use'
import { OVERVIEW_TOKEN_BLACKLIST } from '../../constants'
import FormattedName from '../FormattedName'
import { TYPE } from '../../Theme'
import Panel from '../Panel'
import { useTranslation } from 'react-i18next'
import Percent from 'components/Percent'
import { DashGrid, DataText, ListWrapper, ClickableText, PageButtons, Arrow, List } from './styled'
import LocalLoader from 'components/LocalLoader'

enum TokenSortField {
  liquidity = 'liquidity',
  volume = 'volume',
  symbol = 'symbol',
  name = 'name',
  price = 'price',
  change = 'change'
}

interface ITokensTable {
  tokens: Record<string, Token>
  itemMax?: number
}

function TopTokenList({ tokens, itemMax = 10 }: ITokensTable) {
  const { t } = useTranslation()
  const formatPath = useFormatPath()
  // page state
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(TokenSortField.liquidity)

  const below1080 = useMedia('(max-width: 1080px)')
  const below680 = useMedia('(max-width: 680px)')
  const below600 = useMedia('(max-width: 600px)')
  const below440 = useMedia('(max-width: 440px)')

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [tokens])

  const whiteListTokens = useMemo(() => {
    return tokens && Object.values(tokens).filter(token => !OVERVIEW_TOKEN_BLACKLIST.includes(token.id))
  }, [tokens])

  useEffect(() => {
    if (tokens && whiteListTokens) {
      let extraPages = 1
      if (whiteListTokens.length % itemMax === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(whiteListTokens.length / itemMax) + extraPages)
    }
  }, [tokens, whiteListTokens, itemMax])

  const filteredList = useMemo(() => {
    return (
      whiteListTokens &&
      whiteListTokens
        .sort((a, b) => {
          let order = false
          const direction = sortDirection ? -1 : 1
          switch (sortedColumn) {
            case TokenSortField.liquidity:
              order = a.totalLiquidityUSD > b.totalLiquidityUSD
              break
            case TokenSortField.change:
              order = a.priceChangeUSD > b.priceChangeUSD
              break
            case TokenSortField.name:
              order = a.name > b.name
              break
            case TokenSortField.price:
              order = a.priceUSD > b.priceUSD
              break
            case TokenSortField.symbol:
              order = a.symbol > b.symbol
              break
            case TokenSortField.volume:
            default:
              order = a.dayVolumeUSD > b.dayVolumeUSD
              break
          }
          return order ? direction : direction * -1
        })
        .slice(itemMax * (page - 1), page * itemMax)
    )
  }, [whiteListTokens, itemMax, page, sortDirection, sortedColumn])

  const changeSortDirection = (direction: TokenSortField) => {
    return () => {
      setSortedColumn(direction)
      setSortDirection(sortedColumn !== direction ? true : !sortDirection)
    }
  }

  const ListItem = ({ item, index }: { item: Token; index: number }) => {
    return (
      <DashGrid style={{ padding: below440 ? '.75rem' : '.75rem 2rem' }}>
        <DataText fontWeight="500">
          <Row>
            {!below680 && <div style={{ marginRight: '1rem', width: '10px' }}>{index}</div>}
            <TokenLogo alt={item.symbol} address={item.id} />
            <CustomLink style={{ marginLeft: '16px', whiteSpace: 'nowrap' }} to={formatPath(`/tokens/${item.id}`)}>
              <FormattedName
                text={below680 ? item.symbol : item.name}
                maxCharacters={below600 ? 8 : 16}
                adjustSize={true}
                link={true}
                fontSize={below440 ? 10 : 14}
              />
            </CustomLink>
          </Row>
        </DataText>
        {!below680 && (
          <DataText color="text" fontWeight="500">
            {<FormattedName text={item.symbol} maxCharacters={5} />}
          </DataText>
        )}
        <DataText>{formattedNum(item.totalLiquidityUSD, true)}</DataText>
        <DataText>{formattedNum(item.dayVolumeUSD, true)}</DataText>
        {!below1080 && (
          <DataText color="text" fontWeight="500">
            {formattedNum(item.priceUSD, true)}
          </DataText>
        )}
        {!below1080 && (
          <DataText>
            <Percent percent={item.priceChangeUSD} />
          </DataText>
        )}
      </DashGrid>
    )
  }

  return (
    <ListWrapper>
      <Panel
        style={{
          marginTop: below440 ? '.75rem' : '1.5rem',
          padding: 0
        }}
      >
        <DashGrid style={{ height: 'fit-content', borderTop: 'none' }}>
          <Flex alignItems="center" justifyContent="flexStart">
            <ClickableText color="text" fontWeight="500" onClick={changeSortDirection(TokenSortField.name)}>
              {below680 ? t('symbol') : t('name')}{' '}
              {sortedColumn === TokenSortField.name ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
          {!below680 && (
            <Flex alignItems="center">
              <ClickableText onClick={changeSortDirection(TokenSortField.symbol)}>
                {t('symbol')} {sortedColumn === TokenSortField.symbol ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          )}
          <Flex alignItems="center">
            <ClickableText onClick={changeSortDirection(TokenSortField.liquidity)}>
              {t('liquidity')} {sortedColumn === TokenSortField.liquidity ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
          <Flex alignItems="center">
            <ClickableText onClick={changeSortDirection(TokenSortField.volume)}>
              {t('volume24hrs')}
              {sortedColumn === TokenSortField.volume ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
          {!below1080 && (
            <Flex alignItems="center">
              <ClickableText onClick={changeSortDirection(TokenSortField.price)}>
                {t('price')} {sortedColumn === TokenSortField.price ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          )}
          {!below1080 && (
            <Flex alignItems="center">
              <ClickableText onClick={changeSortDirection(TokenSortField.change)}>
                {t('priceChange24hrs')}
                {sortedColumn === TokenSortField.change ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          )}
        </DashGrid>
        <Divider />
        <List p={0}>
          {filteredList.length > 0 ? (
            filteredList.map((item, index) => (
              <ListItem key={index} index={(page - 1) * itemMax + index + 1} item={item} />
            ))
          ) : (
            <LocalLoader />
          )}
        </List>
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

export default TopTokenList
