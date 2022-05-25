import { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import LocalLoader from 'components/LocalLoader'
import { Flex } from 'rebass'
import Link from 'components/Link'
import { useFormatPath } from 'hooks'
import { Divider } from 'components'
import DoubleTokenLogo from 'components/DoubleLogo'
import { formattedNum, getPoolLink } from 'utils'
import { AutoColumn } from 'components/Column'
import { useActiveTokenPrice } from 'state/features/global/selectors'
import { RowFixed } from 'components/Row'
import { ButtonLight } from 'components/ButtonStyled'
import { TYPE } from 'Theme'
import FormattedName from 'components/FormattedName'
import Panel from 'components/Panel'
import { useTranslation } from 'react-i18next'
import { useActiveNetworkId } from 'state/features/application/selectors'
import {
  PageButtons,
  Arrow,
  List,
  DashGrid,
  ListWrapper,
  ClickableText,
  CustomLink,
  DataText,
  ButtonsContainer
} from './styled'

const SORT_FIELD = {
  VALUE: 'VALUE',
  FEE: 'FEE'
}

type Props = {
  positions: Position[]
}

const PositionList = ({ positions }: Props) => {
  const { t } = useTranslation()
  const formatPath = useFormatPath()
  const activeNetworkId = useActiveNetworkId()

  const below440 = useMedia('(max-width: 440px)')
  const below500 = useMedia('(max-width: 500px)')
  const below740 = useMedia('(max-width: 740px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.VALUE)

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

  const activeTokenPrice = useActiveTokenPrice()

  const ListItem = ({ position, index }: { position: Position; index: number }) => {
    const poolOwnership = parseFloat(position.liquidityTokenBalance) / position.pair.totalSupply
    const valueUSD = poolOwnership * parseFloat(position.pair.reserveUSD)

    return (
      <DashGrid style={{ opacity: poolOwnership > 0 ? 1 : 0.6 }}>
        {!below740 && <DataText>{index}</DataText>}
        <DataText justifyContent="flex-start" alignItems="flex-start">
          <AutoColumn gap="8px" justify="flex-start">
            <DoubleTokenLogo
              size={16}
              a0={position.pair.tokenOne?.id}
              a1={position.pair.tokenTwo?.id}
              margin={!below740}
            />
          </AutoColumn>
          <AutoColumn gap="8px" justify="flex-start" style={{ marginLeft: '20px' }}>
            <CustomLink to={formatPath(`/pairs/${position.pair?.id}`)} style={{ whiteSpace: 'nowrap' }}>
              {`${position.pair.tokenOne?.symbol}-${position.pair.tokenTwo?.symbol}`}
            </CustomLink>

            <ButtonsContainer justify="flex-start">
              <Link
                external
                href={getPoolLink(activeNetworkId, position.pair.tokenOne?.id, position.pair.tokenTwo?.id)}
                style={{ marginRight: '.5rem' }}
              >
                <ButtonLight style={{ padding: '.5rem 1rem', borderRadius: '.625rem' }}>{t('add')}</ButtonLight>
              </Link>
              {poolOwnership > 0 && (
                <Link
                  external
                  href={getPoolLink(activeNetworkId, position.pair.tokenOne?.id, position.pair.tokenTwo?.id, true)}
                >
                  <ButtonLight style={{ padding: '.5rem 1rem', borderRadius: '.625rem' }}>{t('remove')}</ButtonLight>
                </Link>
              )}
            </ButtonsContainer>
          </AutoColumn>
        </DataText>
        <DataText>
          <AutoColumn gap="12px" justify="flex-end">
            <DataText>{formattedNum(valueUSD, true)}</DataText>
            <AutoColumn gap="4px" justify="flex-end">
              <RowFixed>
                <DataText fontWeight={400} fontSize={11}>
                  {formattedNum(poolOwnership * position.pair.tokenOne?.reserve)}
                </DataText>
                <FormattedName
                  text={position.pair.tokenOne?.symbol}
                  maxCharacters={below740 ? 10 : 18}
                  margin={true}
                  fontSize={'11px'}
                />
              </RowFixed>
              <RowFixed>
                <DataText fontWeight={400} fontSize={11}>
                  {formattedNum(poolOwnership * position.pair.tokenTwo?.reserve)}
                </DataText>
                <FormattedName
                  text={position.pair.tokenTwo?.symbol}
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
                <RowFixed>{formattedNum(position?.feeEarned, true)}</RowFixed>
              </TYPE.main>
              <AutoColumn gap="4px" justify="flex-end">
                <RowFixed>
                  <DataText fontWeight={400} fontSize={11}>
                    {position.pair.tokenOne?.price > 0
                      ? formattedNum(
                          position?.feeEarned / (position.pair.tokenOne?.price * activeTokenPrice) / 2,
                          false
                        )
                      : 0}
                  </DataText>
                  <FormattedName
                    text={position.pair.tokenOne?.symbol}
                    maxCharacters={below740 ? 10 : 18}
                    margin={true}
                    fontSize={'11px'}
                  />
                </RowFixed>
                <RowFixed>
                  <DataText fontWeight={400} fontSize={11}>
                    {position.pair.tokenTwo?.price > 0
                      ? formattedNum(
                          position?.feeEarned / (position.pair.tokenTwo?.price * activeTokenPrice) / 2,
                          false
                        )
                      : 0}
                  </DataText>
                  <FormattedName
                    text={position.pair.tokenTwo?.symbol}
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

  const positionsSorted =
    positions &&
    [...positions]

      .sort((p0, p1) => {
        if (sortedColumn === SORT_FIELD.FEE) {
          return p0?.feeEarned > p1?.feeEarned ? (sortDirection ? -1 : 1) : sortDirection ? 1 : -1
        }
        if (sortedColumn === SORT_FIELD.VALUE) {
          const bal0 = (parseFloat(p0.liquidityTokenBalance) / p0.pair.totalSupply) * parseFloat(p0.pair.reserveUSD)
          const bal1 = (parseFloat(p1.liquidityTokenBalance) / p1.pair.totalSupply) * parseFloat(p1.pair.reserveUSD)
          return bal0 > bal1 ? (sortDirection ? -1 : 1) : sortDirection ? 1 : -1
        }
        return 1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
      .map((position: Position, index: number) => {
        return (
          <div key={index}>
            <ListItem key={index} index={(page - 1) * 10 + index + 1} position={position} />
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
            <ClickableText
              onClick={() => {
                setSortedColumn(SORT_FIELD.VALUE)
                setSortDirection(sortedColumn !== SORT_FIELD.VALUE ? true : !sortDirection)
              }}
            >
              {below740 ? t('value') : t('liquidity')}{' '}
              {sortedColumn === SORT_FIELD.VALUE ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
          {!below500 && (
            <Flex alignItems="center" justifyContent="flexEnd">
              <ClickableText
                onClick={() => {
                  setSortedColumn(SORT_FIELD.FEE)
                  setSortDirection(sortedColumn !== SORT_FIELD.FEE ? true : !sortDirection)
                }}
              >
                {below740 ? t('fees') : t('totalFeesEarned')}{' '}
                {sortedColumn === SORT_FIELD.FEE ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          )}
        </DashGrid>
        <Divider />
        <List p={0}>{!positionsSorted ? <LocalLoader /> : positionsSorted}</List>
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

export default PositionList
