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
  transactions: Transactions
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
    case 'mint':
      return 'transaction.add'
    case 'burn':
      return 'transaction.remove'
    case 'swap':
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
  const [transactionType, setTransactionType] = useState<TransactionSelect>(TransactionSelect.All)

  const transactionList = useMemo(() => {
    let list: Transaction[] = []

    switch (transactionType) {
      case TransactionSelect.Adds:
        list = [...transactions.mints]
        break
      case TransactionSelect.Removes:
        list = [...transactions.burns]
        break
      case TransactionSelect.Swaps:
        list = [...transactions.swaps]
        break
      case TransactionSelect.All:
      default:
        list = [...transactions.mints, ...transactions.burns, ...transactions.swaps]
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
          order = a.tokenOne.amount > b.tokenOne.amount
          break
        case TransactionSortField.TokenTwoAmount:
          order = a.tokenTwo.amount > b.tokenTwo.amount
          break
        case TransactionSortField.Timestamp:
        default:
          order = a.timestamp > b.timestamp
          break
      }
      return order ? direction : direction * -1
    })

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
      setSortDirection(sortedColumn !== direction ? true : !sortDirection)
    }
  }

  const ListItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <DashGrid>
        <DataText fontWeight="500">
          <CustomLink
            external
            to={getBlockChainScanLink(activeNetworkId, item.hash, 'transaction')}
            style={{ fontWeight: 700 }}
          >
            {t(getTransactionType(item.type), {
              tokenOneSymbol: item.tokenTwo.symbol,
              tokenTwoSymbol: item.tokenOne.symbol
            })}
          </CustomLink>
        </DataText>
        <DataText>{formattedNum(item.amountUSD, true)}</DataText>
        {!below780 && (
          <>
            <DataText>
              {formattedNum(item.tokenTwo.amount) + ' '} {item.tokenTwo.symbol}
            </DataText>
            <DataText>
              {formattedNum(item.tokenOne.amount) + ' '} {item.tokenOne.symbol}
            </DataText>
          </>
        )}
        {!below1080 && (
          <DataText>
            <CustomLink external to={getBlockChainScanLink(activeNetworkId, item.account, 'address')}>
              {item.account && item.account.slice(0, 6) + '...' + item.account.slice(38, 42)}
            </CustomLink>
          </DataText>
        )}
        <DataText>{formatTime(item.timestamp)}</DataText>
      </DashGrid>
    ),
    []
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
            transactionList
              .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
              .map((item, i) => <ListItem key={`${item.hash}-${i}`} item={item} />)
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
