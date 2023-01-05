import { useState, useEffect, useMemo, useCallback } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import { Flex } from 'rebass'
import { Divider, EmptyCard } from 'components'
import DropdownSelect from 'components/DropdownSelect'
import LocalLoader from 'components/LocalLoader'
import Panel from 'components/Panel'
import { RowBetween, RowFixed } from 'components/Row'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { TYPE } from 'Theme'
import { ellipsisAddress, formattedNumber, formatTime, getBlockChainScanLink } from 'utils'
import { ClickableText, CustomLink, DashGrid, DataText, List, SortText, PageButtons, PaginationButton } from './styled'

interface ITransactionTable {
  transactions?: Transactions
  color?: string
}

enum TransactionSortField {
  AmountUSD = 'AmountUSD',
  TokenOneAmount = 'TokenOneAmount',
  TokenTwoAmount = 'TokenTwoAmount',
  Timestamp = 'Timestamp'
}

enum TransactionSelect {
  All = 'All',
  Swaps = 'Swaps',
  Adds = 'Adds',
  Removes = 'Removes'
}

function getTransactionType(type: TransactionType): string {
  switch (type) {
    case 'mint': {
      return 'transaction.add'
    }
    case 'burn': {
      return 'transaction.remove'
    }
    case 'swap': {
      return 'transaction.swap'
    }
    default: {
      return ''
    }
  }
}

const ITEMS_PER_PAGE = 10

export const TransactionTable = ({ transactions, color }: ITransactionTable) => {
  const { t } = useTranslation()
  const activeNetworkId = useActiveNetworkId()

  const below1080 = useMedia('(max-width: 1080px)')
  const below780 = useMedia('(max-width: 780px)')
  const below440 = useMedia('(max-width: 440px)')

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(0)
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(TransactionSortField.Timestamp)
  const [transactionType, setTransactionType] = useState<TransactionSelect>(TransactionSelect.All)

  const transactionList = useMemo(() => {
    let list: Transaction[] = []
    if (transactions) {
      switch (transactionType) {
        case TransactionSelect.Adds: {
          list = [...transactions.mints]
          break
        }
        case TransactionSelect.Removes: {
          list = [...transactions.burns]
          break
        }
        case TransactionSelect.Swaps: {
          list = [...transactions.swaps]
          break
        }
        case TransactionSelect.All:
        default: {
          list = [...transactions.mints, ...transactions.burns, ...transactions.swaps]
          break
        }
      }

      list.sort((a, b) => {
        let order = false
        const direction = sortDirection ? -1 : 1
        switch (sortedColumn) {
          case TransactionSortField.AmountUSD: {
            order = a.amountUSD > b.amountUSD
            break
          }
          case TransactionSortField.TokenOneAmount: {
            order = a.tokenOne.amount > b.tokenOne.amount
            break
          }
          case TransactionSortField.TokenTwoAmount: {
            order = a.tokenTwo.amount > b.tokenTwo.amount
            break
          }
          case TransactionSortField.Timestamp:
          default: {
            order = a.timestamp > b.timestamp
            break
          }
        }
        return order ? direction : direction * -1
      })
    }
    return list
  }, [transactionType, sortedColumn, sortDirection, transactions])

  const changeTransactionType = (type: TransactionSelect) => {
    return () => {
      setTransactionType(type)
    }
  }
  const changeSortDirection = (direction: TransactionSortField) => {
    return () => {
      setSortedColumn(direction)
      setSortDirection(sortedColumn === direction ? !sortDirection : true)
    }
  }

  const sortDirectionArrow = (column: TransactionSortField) => {
    const sortedSymbol = sortDirection ? '↓' : '↑'
    return sortedColumn === column ? sortedSymbol : ''
  }

  const incrementPage = () => {
    setPage(page === 1 ? page : page - 1)
  }

  const decrementPage = () => {
    setPage(page === maxPage ? page : page + 1)
  }

  const ListItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <DashGrid>
        <DataText fontWeight="500">
          <CustomLink
            external
            href={getBlockChainScanLink(activeNetworkId, item.hash, 'transaction')}
            style={{ fontWeight: 700 }}
          >
            {t(getTransactionType(item.type), {
              tokenOneSymbol: item.tokenOne.symbol,
              tokenTwoSymbol: item.tokenTwo.symbol
            })}
          </CustomLink>
        </DataText>
        <DataText>{formattedNumber(item.amountUSD, true)}</DataText>
        {!below780 && (
          <>
            <DataText>{`${formattedNumber(item.tokenOne.amount)} ${item.tokenOne.symbol}`}</DataText>
            <DataText>{`${formattedNumber(item.tokenTwo.amount)} ${item.tokenTwo.symbol}`}</DataText>
          </>
        )}
        {!below1080 && (
          <DataText>
            <CustomLink external href={getBlockChainScanLink(activeNetworkId, item.account, 'address')}>
              {item.account && ellipsisAddress(item.account)}
            </CustomLink>
          </DataText>
        )}
        <DataText>{formatTime(item.timestamp)}</DataText>
      </DashGrid>
    ),
    [activeNetworkId]
  )

  useEffect(() => {
    let extraPages = 1
    if (transactionList.length % ITEMS_PER_PAGE === 0) {
      extraPages = 0
    }
    if (transactionList.length === 0) {
      setMaxPage(1)
    } else {
      setMaxPage(Math.floor(transactionList.length / ITEMS_PER_PAGE) + extraPages)
    }
    setPage(1)
  }, [transactionList.length])

  useEffect(() => {
    setPage(1)
  }, [transactionType])

  return (
    <>
      <Panel
        style={{
          marginTop: below440 ? '.75rem' : '1.5rem',
          padding: 0
        }}
      >
        <DashGrid>
          {below780 ? (
            <RowBetween>
              <DropdownSelect
                options={TransactionSelect}
                active={transactionType}
                setActive={setTransactionType}
                color={color}
              />
            </RowBetween>
          ) : (
            <RowFixed pl={4}>
              <SortText
                onClick={changeTransactionType(TransactionSelect.All)}
                active={transactionType === TransactionSelect.All}
              >
                {t('all')}
              </SortText>
              <SortText
                onClick={changeTransactionType(TransactionSelect.Swaps)}
                active={transactionType === TransactionSelect.Swaps}
              >
                {t('swaps')}
              </SortText>
              <SortText
                onClick={changeTransactionType(TransactionSelect.Adds)}
                active={transactionType === TransactionSelect.Adds}
              >
                {t('adds')}
              </SortText>
              <SortText
                onClick={changeTransactionType(TransactionSelect.Removes)}
                active={transactionType === TransactionSelect.Removes}
              >
                {t('removes')}
              </SortText>
            </RowFixed>
          )}

          <Flex alignItems="center" justifyContent="flexStart">
            <ClickableText color="textDim" onClick={changeSortDirection(TransactionSortField.AmountUSD)}>
              {t('totalValue')} {sortDirectionArrow(TransactionSortField.AmountUSD)}
            </ClickableText>
          </Flex>
          {!below780 && (
            <Flex alignItems="center">
              <ClickableText color="textDim" onClick={changeSortDirection(TransactionSortField.TokenOneAmount)}>
                {t('tokenAmount')} {sortDirectionArrow(TransactionSortField.TokenOneAmount)}
              </ClickableText>
            </Flex>
          )}
          <>
            {!below780 && (
              <Flex alignItems="center">
                <ClickableText color="textDim" onClick={changeSortDirection(TransactionSortField.TokenTwoAmount)}>
                  {t('tokenAmount')} {sortDirectionArrow(TransactionSortField.TokenTwoAmount)}
                </ClickableText>
              </Flex>
            )}
            {!below1080 && (
              <Flex alignItems="center">
                <TYPE.body>{t('account')}</TYPE.body>
              </Flex>
            )}
            <Flex alignItems="center">
              <ClickableText color="textDim" onClick={changeSortDirection(TransactionSortField.Timestamp)}>
                {t('time')} {sortDirectionArrow(TransactionSortField.Timestamp)}
              </ClickableText>
            </Flex>
          </>
        </DashGrid>
        <Divider />
        {transactions ? (
          <List p={0}>
            {transactionList.length > 0 ? (
              transactionList
                .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
                .map((item, index) => <ListItem key={`${item.hash}-${index}`} item={item} />)
            ) : (
              <EmptyCard>{t('noRecentTransactions')}</EmptyCard>
            )}
          </List>
        ) : (
          <List p={0}>
            <LocalLoader />
          </List>
        )}
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
    </>
  )
}
