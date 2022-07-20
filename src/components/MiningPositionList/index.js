import { useState, useEffect } from 'react'
import { transparentize } from 'polished'
import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components/macro'
import { Divider } from 'components'
import { ButtonLight } from 'components/ButtonStyled'
import { AutoColumn } from 'components/Column'
import DoubleTokenLogo from 'components/DoubleLogo'
import FormattedName from 'components/FormattedName'
import Link, { CustomLink } from 'components/Link'
import LocalLoader from 'components/LocalLoader'
import Panel from 'components/Panel'
import { RowFixed } from 'components/Row'
import { useFormatPath } from 'hooks'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { TYPE } from 'Theme'
import { formattedNumber, getWhiteSwapAppLink } from 'utils'

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;

  @media screen and (max-width: 440px) {
    margin-top: 0.75rem;
  }
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.primary1};
  opacity: ${props => (props.faded ? 0.3 : 1)};
  padding: 0 1.25rem;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 5px 0.5fr 1fr;
  grid-template-areas: 'number name uniswap';
  align-items: flex-start;
  padding: 1rem 2rem;
  border-top: 1px solid ${({ theme }) => theme.bg7};

  > * {
    justify-content: flex-end;
    width: 100%;

    :first-child {
      justify-content: flex-start;
      text-align: left;
      width: 1.25rem;
    }
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 35px 2.5fr 1fr;
    grid-template-areas: 'number name uniswap';
  }

  @media screen and (max-width: 740px) {
    grid-template-columns: 2.5fr 1fr;
    grid-template-areas: 'name uniswap';
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 2.5fr 1fr;
    grid-template-areas: 'name uniswap';
  }

  @media screen and (max-width: 440px) {
    padding: 0.75rem;
  }
`

const ListWrapper = styled.div``

const ClickableText = styled(Text)`
  color: ${({ theme }) => transparentize(0.3, theme.text6)};
  user-select: none;
  text-align: end;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }

  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: right;
  color: ${({ theme }) => transparentize(0.5, theme.text6)};

  & > * {
    font-size: 1em;
  }

  @media screen and (max-width: 40em) {
    font-size: 0.85rem;
  }
`

const SORT_FIELD = {
  VALUE: 'VALUE',
  UNISWAP_RETURN: 'UNISWAP_RETURN'
}

function MiningPositionList({ miningPositions }) {
  const { t } = useTranslation()
  const formatPath = useFormatPath()
  const activeNetworkId = useActiveNetworkId()

  // const below500 = useMedia('(max-width: 500px)')
  const below440 = useMedia('(max-width: 440px)')
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
  }, [miningPositions])

  useEffect(() => {
    if (miningPositions) {
      let extraPages = 1
      if (miningPositions.length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(miningPositions.length / ITEMS_PER_PAGE) + extraPages || 1)
    }
  }, [miningPositions])

  const ListItem = ({ miningPosition, index }) => {
    const pairPercentage = miningPosition.balance / miningPosition.pairData.totalSupply
    const valueUSD = miningPosition.pairData.reserveUSD
    const valueFirstPair = miningPosition.pairData.reserve0
    const valueSecondPair = miningPosition.pairData.reserve1
    const firstPairName = miningPosition.miningPool.pair.token0
    const secondPairName = miningPosition.miningPool.pair.token1
    const pairAddress = miningPosition.miningPool.pair.id
    const firstPairAddress = miningPosition.pairData.token0.id
    const secondPairAddress = miningPosition.pairData.token1.id

    return (
      <DashGrid style={{ opacity: pairPercentage > 0 ? 1 : 0.6 }} focus={true}>
        {!below740 && <DataText area="number">{index}</DataText>}
        <DataText area="name" justifyContent="flex-start" alignItems="flex-start">
          <AutoColumn gap="8px" justify="flex-start" align="flex-start">
            <DoubleTokenLogo size={16} a0={firstPairAddress} a1={secondPairAddress} margin={!below740} />
          </AutoColumn>
          <AutoColumn gap="8px" justify="flex-start" style={{ marginLeft: '20px' }}>
            <CustomLink to={formatPath(`/pairs/${pairAddress}`)}>
              <TYPE.main style={{ whiteSpace: 'nowrap' }} to={formatPath(`/pairs/`)}>
                <FormattedName text={firstPairName + '-' + secondPairName} maxCharacters={below740 ? 10 : 18} />
              </TYPE.main>
            </CustomLink>
            <RowFixed gap="8px" justify="flex-start">
              <Link
                external
                href={getWhiteSwapAppLink(activeNetworkId, firstPairAddress)}
                style={{ marginRight: '.5rem' }}
              >
                <ButtonLight style={{ padding: '4px 6px', borderRadius: '4px' }}>Stake More</ButtonLight>
              </Link>
              {pairPercentage > 0 && (
                <Link external href={getWhiteSwapAppLink(activeNetworkId, firstPairAddress)}>
                  <ButtonLight style={{ padding: '4px 6px', borderRadius: '4px' }}>Withdraw</ButtonLight>
                </Link>
              )}
            </RowFixed>
          </AutoColumn>
        </DataText>
        <DataText area="uniswap">
          <AutoColumn gap="12px" justify="flex-end">
            <TYPE.main>{formattedNumber(pairPercentage * valueUSD, true, true)}</TYPE.main>
            <AutoColumn gap="4px" justify="flex-end">
              <RowFixed>
                <TYPE.small fontWeight={400}>
                  {formattedNumber(pairPercentage * Number.parseFloat(valueFirstPair))}{' '}
                </TYPE.small>
                <FormattedName
                  text={firstPairName}
                  maxCharacters={below740 ? 10 : 18}
                  margin={true}
                  fontSize={'11px'}
                />
              </RowFixed>
              <RowFixed>
                <TYPE.small fontWeight={400}>
                  {formattedNumber(pairPercentage * Number.parseFloat(valueSecondPair))}{' '}
                </TYPE.small>
                <FormattedName
                  text={secondPairName}
                  maxCharacters={below740 ? 10 : 18}
                  margin={true}
                  fontSize={'11px'}
                />
              </RowFixed>
            </AutoColumn>
          </AutoColumn>
        </DataText>
      </DashGrid>
    )
  }

  const miningPositionsSorted =
    miningPositions &&
    miningPositions

      .sort((p0, p1) => {
        if (sortedColumn === SORT_FIELD.VALUE) {
          const bal0 = (p0.balance / p0.pairData.totalSupply) * p0.pairData.reserveUSD
          const bal1 = (p0.balance / p0.pairData.totalSupply) * p1.pairData.reserveUSD
          return bal0 > bal1 ? (sortDirection ? -1 : 1) : sortDirection ? 1 : -1
        }
        return 1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
      .map((miningPosition, index) => {
        return (
          <div key={index}>
            <ListItem key={index} index={(page - 1) * ITEMS_PER_PAGE + index + 1} miningPosition={miningPosition} />
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
        <DashGrid
          center={true}
          style={{ height: 'fit-content', padding: below440 ? '.75rem' : '1rem 2rem', border: 'unset' }}
        >
          {!below740 && (
            <Flex alignItems="flex-start" justifyContent="flexStart">
              <ClickableText area="number">#</ClickableText>
            </Flex>
          )}
          <Flex alignItems="flex-start" justifyContent="flex-start">
            <ClickableText area="number">{t('name')}</ClickableText>{' '}
          </Flex>
          <Flex alignItems="center" justifyContent="flexEnd">
            <ClickableText
              area="uniswap"
              onClick={() => {
                setSortedColumn(SORT_FIELD.VALUE)
                setSortDirection(sortedColumn !== SORT_FIELD.VALUE ? true : !sortDirection)
              }}
            >
              {below740 ? t('value') : t('liquidity')}{' '}
              {sortedColumn === SORT_FIELD.VALUE ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
        </DashGrid>
        <Divider />
        <List p={0}>{!miningPositionsSorted ? <LocalLoader /> : miningPositionsSorted}</List>
      </Panel>
      <PageButtons>
        <div onClick={() => setPage(page === 1 ? page : page - 1)}>
          <Arrow faded={page === 1}>←</Arrow>
        </div>
        <TYPE.body>{`${t('page')} ${page} ${t('of')} ${maxPage}`}</TYPE.body>
        <div onClick={() => setPage(page === maxPage ? page : page + 1)}>
          <Arrow faded={page === maxPage}>→</Arrow>
        </div>
      </PageButtons>
    </ListWrapper>
  )
}

export default MiningPositionList
