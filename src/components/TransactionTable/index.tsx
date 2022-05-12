import { Divider, EmptyCard } from 'components'
import DropdownSelect from 'components/DropdownSelect'
import LocalLoader from 'components/LocalLoader'
import Panel from 'components/Panel'
import { RowBetween, RowFixed } from 'components/Row'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import { Flex } from 'rebass'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { TYPE } from 'Theme'
import { formattedNum, formatTime, getBlockChainScanLink } from 'utils'
import { ClickableText, CustomLink, DashGrid, DataText, List, SortText, PageButtons, Arrow } from './styled'

interface ITransactionTable {
  transactions: TransactionsV2
  color?: string
}

enum TransactionSortField {
  AmountUSD = 'AmountUSD',
  TokenOneAmount = 'TokenOneAmount',
  TokenTwoAmount = 'TokenTwoAmount',
  Timestamp = 'Timestamp'
}

enum TransactionType {
  All = 'All',
  Swap = 'Swap',
  Add = 'Add',
  Remove = 'Remove'
}

type TransactionItem = TransactionV2 & { type: TransactionType }

function getTransactionType(type: TransactionType): string {
  switch (type) {
    case TransactionType.Add:
      return 'transaction.add'
    case TransactionType.Remove:
      return 'transaction.remove'
    case TransactionType.Swap:
      return 'transaction.swap'
    default:
      return ''
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
  const [maxPage, setMaxPage] = useState(1)
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(TransactionSortField.Timestamp)
  const [transactionType, setTransactionType] = useState(TransactionType.All)

  const transactionsData = useMemo(() => {
    return {
      mints: transactions?.mints?.map(el => ({ ...el, type: TransactionType.Add })) || [],
      swaps: transactions?.swaps?.map(el => ({ ...el, type: TransactionType.Swap })) || [],
      burns: transactions?.burns?.map(el => ({ ...el, type: TransactionType.Remove })) || []
    }
  }, [transactions])
  const transactionList = useMemo(() => {
    let list: TransactionItem[] = []

    switch (transactionType) {
      case TransactionType.Add:
        list = transactionsData.mints
        break
      case TransactionType.Remove:
        list = transactionsData.burns
        break
      case TransactionType.Swap:
        list = transactionsData.swaps
        break
      case TransactionType.All:
      default:
        list = [...transactionsData.mints, ...transactionsData.burns, ...transactionsData.swaps]
        break
    }

    list.sort((a, b) => {
      let order = false
      const direction = sortDirection ? -1 : 1
      switch (sortedColumn) {
        case TransactionSortField.AmountUSD:
          order = a.amountUSD > b.amountUSD
          break
        case TransactionSortField.TokenOneAmount:
          order = a.tokenOneAmount > b.tokenOneAmount
          break
        case TransactionSortField.TokenTwoAmount:
          order = a.tokenTwoAmount > b.tokenTwoAmount
          break
        case TransactionSortField.Timestamp:
        default:
          order = a.timestamp > b.timestamp
          break
      }
      return order ? direction : direction * -1
    })

    return list
  }, [transactionType, sortedColumn, sortDirection, transactionsData])

  const changeTransactionType = (type: TransactionType) => {
    return () => {
      setTransactionType(type)
    }
  }
  const changeSortDirection = (direction: TransactionSortField) => {
    return () => {
      setSortedColumn(direction)
      setSortDirection(sortedColumn !== direction ? true : !sortDirection)
    }
  }

  const ListItem = useCallback(({ item }: { item: TransactionItem }) => {
    if (item.tokenOneSymbol === 'WETH') {
      item.tokenOneSymbol = 'ETH'
    }

    if (item.tokenTwoSymbol === 'WETH') {
      item.tokenTwoSymbol = 'ETH'
    }

    return (
      <DashGrid>
        <DataText fontWeight="500">
          <CustomLink
            external
            href={getBlockChainScanLink(activeNetworkId, item.hash, 'transaction')}
            style={{ fontWeight: 700 }}
          >
            {t(getTransactionType(item.type), {
              tokenOneSymbol: item.tokenTwoSymbol,
              tokenTwoSymbol: item.tokenOneSymbol
            })}
          </CustomLink>
        </DataText>
        <DataText>{formattedNum(item.amountUSD, true)}</DataText>
        {!below780 && (
          <>
            <DataText>
              {formattedNum(item.tokenTwoAmount) + ' '} {item.tokenTwoSymbol}
            </DataText>
            <DataText>
              {formattedNum(item.tokenOneAmount) + ' '} {item.tokenOneSymbol}
            </DataText>
          </>
        )}
        {!below1080 && (
          <DataText>
            <CustomLink external href={getBlockChainScanLink(activeNetworkId, item.account, 'address')}>
              {item.account && item.account.slice(0, 6) + '...' + item.account.slice(38, 42)}
            </CustomLink>
          </DataText>
        )}
        <DataText>{formatTime(item.timestamp)}</DataText>
      </DashGrid>
    )
  }, [])

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
                options={TransactionType}
                active={transactionType}
                setActive={setTransactionType}
                color={color}
              />
            </RowBetween>
          ) : (
            <RowFixed pl={4}>
              <SortText
                onClick={changeTransactionType(TransactionType.All)}
                active={transactionType === TransactionType.All}
              >
                {t('all')}
              </SortText>
              <SortText
                onClick={changeTransactionType(TransactionType.Swap)}
                active={transactionType === TransactionType.Swap}
              >
                {t('swaps')}
              </SortText>
              <SortText
                onClick={changeTransactionType(TransactionType.Add)}
                active={transactionType === TransactionType.Add}
              >
                {t('adds')}
              </SortText>
              <SortText
                onClick={changeTransactionType(TransactionType.Remove)}
                active={transactionType === TransactionType.Remove}
              >
                {t('removes')}
              </SortText>
            </RowFixed>
          )}

          <Flex alignItems="center" justifyContent="flexStart">
            <ClickableText color="textDim" onClick={changeSortDirection(TransactionSortField.AmountUSD)}>
              {t('totalValue')}{' '}
              {sortedColumn === TransactionSortField.AmountUSD ? (!sortDirection ? '↑' : '↓') : undefined}
            </ClickableText>
          </Flex>
          {!below780 && (
            <Flex alignItems="center">
              <ClickableText color="textDim" onClick={changeSortDirection(TransactionSortField.TokenOneAmount)}>
                {t('tokenAmount')}{' '}
                {sortedColumn === TransactionSortField.TokenOneAmount ? (sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          )}
          <>
            {!below780 && (
              <Flex alignItems="center">
                <ClickableText color="textDim" onClick={changeSortDirection(TransactionSortField.TokenTwoAmount)}>
                  {t('tokenAmount')}{' '}
                  {sortedColumn === TransactionSortField.TokenTwoAmount ? (sortDirection ? '↑' : '↓') : ''}
                </ClickableText>
              </Flex>
            )}
            {!below1080 && (
              <Flex alignItems="center">
                <TYPE.body area="account">{t('account')}</TYPE.body>
              </Flex>
            )}
            <Flex alignItems="center">
              <ClickableText color="textDim" onClick={changeSortDirection(TransactionSortField.Timestamp)}>
                {t('time')} {sortedColumn === TransactionSortField.Timestamp ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          </>
        </DashGrid>
        <Divider />
        <List p={0}>
          {!transactions ? <LocalLoader /> : undefined}
          {transactionList.length > 0 ? (
            transactionList.slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE).map(item => (
              <div key={item.hash}>
                <ListItem item={item} />
                <Divider />
              </div>
            ))
          ) : (
            <EmptyCard>{t('noRecentTransactions')}</EmptyCard>
          )}
        </List>
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
    </>
  )
}
