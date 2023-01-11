import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import { Flex } from 'rebass'
import { Divider } from 'components'
import { ButtonLight } from 'components/ButtonStyled'
import { AutoColumn } from 'components/Column'
import DoubleTokenLogo from 'components/DoubleLogo'
import FormattedName from 'components/FormattedName'
import Link from 'components/Link'
import LocalLoader from 'components/LocalLoader'
import Panel from 'components/Panel'
import { RowFixed } from 'components/Row'
import { useFormatPath } from 'hooks'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { TYPE } from 'Theme'
import { formattedNumber, getExchangeLink } from 'utils'
import {
  PageButtons,
  List,
  DashGrid,
  ListWrapper,
  ClickableText,
  CustomLink,
  DataText,
  ButtonsContainer,
  PaginationButton
} from './styled'

enum PositionSortField {
  value = 'value',
  fee = 'fee'
}

interface IPositionList {
  positions?: Position[]
}

const ListItem = ({
  position: { totalUsd, tokenOne, tokenTwo, pairAddress, earningFeeTotalUsd },
  index
}: {
  position: Position
  index: number
}) => {
  const { t } = useTranslation()
  const below500 = useMedia('(max-width: 500px)')
  const below740 = useMedia('(max-width: 740px)')
  const activeNetworkId = useActiveNetworkId()
  const formatPath = useFormatPath()

  return (
    <DashGrid style={{ opacity: totalUsd > 0 ? 1 : 0.6 }}>
      {!below740 && <DataText>{index}</DataText>}
      <DataText justifyContent="flex-start" alignItems="flex-start">
        <AutoColumn gap="8px" justify="flex-start">
          <DoubleTokenLogo size={16} a0={tokenOne.id} a1={tokenTwo.id} margin={!below740} />
        </AutoColumn>
        <AutoColumn gap="8px" justify="flex-start" style={{ marginLeft: '20px' }}>
          <CustomLink to={formatPath(`/pairs/${pairAddress}`)} style={{ whiteSpace: 'nowrap' }}>
            {`${tokenOne.symbol}-${tokenTwo.symbol}`}
          </CustomLink>

          <ButtonsContainer justify="flex-start">
            <Link
              external
              href={getExchangeLink({
                network: activeNetworkId,
                inputCurrency: tokenOne.id,
                outputCurrency: tokenTwo.id,
                type: 'add'
              })}
              style={{ marginRight: '.5rem' }}
            >
              <ButtonLight style={{ padding: '.5rem 1rem', borderRadius: '.625rem' }}>{t('add')}</ButtonLight>
            </Link>
            {totalUsd > 0 && (
              <Link
                external
                href={getExchangeLink({
                  network: activeNetworkId,
                  inputCurrency: tokenOne?.id,
                  outputCurrency: tokenTwo?.id,
                  type: 'remove'
                })}
              >
                <ButtonLight style={{ padding: '.5rem 1rem', borderRadius: '.625rem' }}>{t('remove')}</ButtonLight>
              </Link>
            )}
          </ButtonsContainer>
        </AutoColumn>
      </DataText>
      <DataText>
        <AutoColumn gap="12px" justify="flex-end">
          <DataText>{formattedNumber(totalUsd, true)}</DataText>
          <AutoColumn gap="4px" justify="flex-end">
            <RowFixed>
              <DataText fontWeight={400} fontSize={11}>
                {formattedNumber(tokenOne.amount)}
              </DataText>
              <FormattedName
                text={tokenOne.symbol}
                maxCharacters={below740 ? 10 : 18}
                margin={true}
                fontSize={'11px'}
              />
            </RowFixed>
            <RowFixed>
              <DataText fontWeight={400} fontSize={11}>
                {formattedNumber(tokenTwo.amount)}
              </DataText>
              <FormattedName
                text={tokenTwo.symbol}
                maxCharacters={below740 ? 10 : 18}
                margin={true}
                fontSize={'11px'}
              />
            </RowFixed>
          </AutoColumn>
        </AutoColumn>
      </DataText>
      {!below500 && (
        <DataText>
          <AutoColumn gap="12px" justify="flex-end">
            <TYPE.main color={'green'}>
              <RowFixed>{formattedNumber(earningFeeTotalUsd, true)}</RowFixed>
            </TYPE.main>
            <AutoColumn gap="4px" justify="flex-end">
              <RowFixed>
                <DataText fontWeight={400} fontSize={11}>
                  {formattedNumber(tokenOne.fee)}
                </DataText>
                <FormattedName
                  text={tokenOne.symbol}
                  maxCharacters={below740 ? 10 : 18}
                  margin={true}
                  fontSize={'11px'}
                />
              </RowFixed>
              <RowFixed>
                <DataText fontWeight={400} fontSize={11}>
                  {formattedNumber(tokenTwo.fee)}
                </DataText>
                <FormattedName
                  text={tokenTwo.symbol}
                  maxCharacters={below740 ? 10 : 18}
                  margin={true}
                  fontSize={'11px'}
                />
              </RowFixed>
            </AutoColumn>
          </AutoColumn>
        </DataText>
      )}
    </DashGrid>
  )
}

const PositionList = ({ positions }: IPositionList) => {
  const { t } = useTranslation()
  const below440 = useMedia('(max-width: 440px)')
  const below500 = useMedia('(max-width: 500px)')
  const below740 = useMedia('(max-width: 740px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(PositionSortField.value)

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [positions])

  useEffect(() => {
    if (positions) {
      let extraPages = 1
      if (positions.length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(positions.length / ITEMS_PER_PAGE) + extraPages || 1)
    }
  }, [positions])

  const changeSortDirection = (direction: PositionSortField) => {
    return () => {
      setSortedColumn(direction)
      setSortDirection(sortedColumn === direction ? !sortDirection : true)
    }
  }

  const sortDirectionArrow = (column: PositionSortField) => {
    const sortedSymbol = sortDirection ? '↓' : '↑'
    return sortedColumn === column ? sortedSymbol : ''
  }

  const incrementPage = () => {
    setPage(page === 1 ? page : page - 1)
  }

  const decrementPage = () => {
    setPage(page === maxPage ? page : page + 1)
  }

  const positionsSorted = useMemo(() => {
    if (positions) {
      return [...positions]
        .sort((p0, p1) => {
          let order = false
          const direction = sortDirection ? -1 : 1
          switch (sortedColumn) {
            case PositionSortField.fee: {
              order = p0?.earningFeeTotalUsd > p1?.earningFeeTotalUsd
              break
            }
            case PositionSortField.value:
            default: {
              order = p0.totalUsd > p1.totalUsd
              break
            }
          }
          return order ? direction : direction * -1
        })
        .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
    }
    return undefined
  }, [positions, page, sortDirection, sortedColumn])

  return (
    <ListWrapper>
      <Panel
        style={{
          marginTop: below440 ? '.75rem' : '1.5rem',
          padding: 0
        }}
      >
        <DashGrid style={{ height: 'fit-content', padding: below440 ? '.75rem' : '1rem 2rem', border: 'unset' }}>
          {!below740 && (
            <Flex alignItems="flex-start" justifyContent="flexStart">
              <ClickableText>#</ClickableText>
            </Flex>
          )}
          <Flex alignItems="flex-start" justifyContent="flex-start">
            <ClickableText>{t('name')}</ClickableText>
          </Flex>
          <Flex alignItems="center" justifyContent="flexEnd">
            <ClickableText onClick={changeSortDirection(PositionSortField.value)}>
              {below740 ? t('value') : t('liquidity')} {sortDirectionArrow(PositionSortField.value)}
            </ClickableText>
          </Flex>
          {!below500 && (
            <Flex alignItems="center" justifyContent="flexEnd">
              <ClickableText onClick={changeSortDirection(PositionSortField.fee)}>
                {below740 ? t('fees') : t('totalFeesEarned')} {sortDirectionArrow(PositionSortField.fee)}
              </ClickableText>
            </Flex>
          )}
        </DashGrid>
        <Divider />
        <List p={0}>
          {positionsSorted ? (
            positionsSorted.map((position, index) => (
              <div key={index}>
                <ListItem key={index} index={(page - 1) * 10 + index + 1} position={position} />
                <Divider />
              </div>
            ))
          ) : (
            <LocalLoader />
          )}
        </List>
      </Panel>
      {maxPage ? (
        <PageButtons>
          <PaginationButton type="button" disabled={page === 1} onClick={incrementPage}>
            <ArrowLeft width="1rem" height="1rem" />
          </PaginationButton>
          <TYPE.body>{t('pagination', { currentPage: page, maxPage })}</TYPE.body>
          <PaginationButton type="button" disabled={page === maxPage} onClick={decrementPage}>
            <ArrowRight width="1rem" height="1rem" />
          </PaginationButton>
        </PageButtons>
      ) : undefined}
    </ListWrapper>
  )
}

export default PositionList
