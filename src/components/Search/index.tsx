import { useState, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import DoubleTokenLogo from 'components/DoubleLogo'
import { BasicLink } from 'components/Link'
import { RowFixed } from 'components/Row'
import TokenLogo from 'components/TokenLogo'
import { SupportedNetwork } from 'constants/networks'
import { useFormatPath } from 'hooks'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { usePairs } from 'state/features/pairs/selectors'
import { PairDetails } from 'state/features/pairs/types'
import { useTokens } from 'state/features/token/selectors'
import { TokenDetails } from 'state/features/token/types'
import { TYPE } from 'Theme'
import { escapeRegExp, isValidAddress, specialChars } from 'utils'
import {
  Container,
  Wrapper,
  Input,
  SearchIconLarge,
  CloseIcon,
  Gray,
  MenuItem,
  Blue,
  Heading,
  Menu,
  TokenText
} from './styled'

const Search = () => {
  const { t } = useTranslation()
  const formatPath = useFormatPath()
  const activeNetwork = useActiveNetworkId()

  // refs to detect clicks outside modal
  const wrapperReference = useRef(null)

  const allTokens = useTokens()
  const allPools = usePairs()

  const [showMenu, toggleMenu] = useState(false)
  const [value, setValue] = useState('')
  const [tokenData, setTokenData] = useState<TokenDetails[]>([])
  const [poolData, setPoolData] = useState<PairDetails[]>([])
  const [tokensShown, setTokensShown] = useState(3)
  const [pairsShown, setPairsShown] = useState(3)

  const newTokens = useMemo(() => {
    return tokenData.filter(t => !Object.keys(allTokens).includes(t.id))
  }, [allTokens, tokenData])

  const combinedTokens = useMemo(() => {
    return [...newTokens, ...Object.values(allTokens)]
  }, [allTokens, newTokens])

  const tokensForList = useMemo(() => {
    return combinedTokens
      .filter(t => {
        const regexMatches = Object.keys(t).map(tokenEntryKey => {
          const isAddress = isValidAddress(value, activeNetwork)
          if (tokenEntryKey === 'id' && isAddress) {
            return t[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
          }
          if (tokenEntryKey === 'symbol' && !isAddress) {
            return t[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
          }
          if (tokenEntryKey === 'name' && !isAddress) {
            return t[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
          }
          return false
        })
        return regexMatches.some(Boolean)
      })
      .sort((t0, t1) => (t0.totalLiquidityUSD > t1.totalLiquidityUSD ? -1 : 1))
  }, [combinedTokens, value])

  const newPools = useMemo(() => {
    return poolData.filter(p => !Object.keys(allPools).includes(p.id))
  }, [allPools, poolData])

  const combinedPools = useMemo(() => {
    return [...newPools, ...Object.values(allPools)]
  }, [allPools, newPools])

  const poolForList = useMemo(() => {
    return combinedPools
      .filter(t => {
        const regexMatches = Object.keys(t || {}).map(key => {
          const isAddress = isValidAddress(value, activeNetwork)
          const firstTokenValue = value.includes('-') ? value.slice(0, value.indexOf('-')) : ''
          const secondTokenValue = value.includes('-') ? value.slice(value.indexOf('-') + 1) : ''

          if (key === 'id' && isAddress) {
            return t[key].match(new RegExp(escapeRegExp(value), 'i'))
          }

          //won't filter with special characters at the second part of the value
          if (secondTokenValue && specialChars(secondTokenValue)) return

          //filter when first part of the value appears to be tokenTwo
          if (
            key === 'tokenTwo' &&
            firstTokenValue &&
            (t[key].symbol.toLocaleLowerCase() === firstTokenValue.toLocaleLowerCase() ||
              t[key].name.toLocaleLowerCase() === firstTokenValue.toLocaleLowerCase()) &&
            !isAddress
          ) {
            return
          }

          //filter only match for first and the second parts of the value
          if (firstTokenValue && secondTokenValue) {
            return (
              (t['tokenOne'].name.match(new RegExp(escapeRegExp(firstTokenValue), 'i')) ||
                t['tokenOne'].symbol
                  .toLocaleLowerCase()
                  .match(new RegExp(escapeRegExp(firstTokenValue.toLocaleLowerCase()), 'i'))) &&
              (t['tokenTwo'].name.match(new RegExp(escapeRegExp(secondTokenValue), 'i')) ||
                t['tokenTwo'].symbol
                  .toLocaleLowerCase()
                  .match(new RegExp(escapeRegExp(secondTokenValue.toLocaleLowerCase()), 'i')))
            )
          }

          //filter when first token value exist, allows '-' to be inserted
          if ((key === 'tokenOne' || key === 'tokenTwo') && firstTokenValue && !isAddress) {
            return (
              t[key].name.match(new RegExp(escapeRegExp(firstTokenValue), 'i')) ||
              t[key].symbol
                .toLocaleLowerCase()
                .match(new RegExp(escapeRegExp(firstTokenValue.toLocaleLowerCase()), 'i'))
            )
          }
          //filter character by character match
          if ((key === 'tokenOne' || key === 'tokenTwo') && !isAddress) {
            return (
              t[key].name.match(new RegExp(escapeRegExp(value), 'i')) ||
              t[key].symbol.toLocaleLowerCase().match(new RegExp(escapeRegExp(value.toLocaleLowerCase()), 'i'))
            )
          }
          return false
        })
        return regexMatches.some(Boolean)
      })
      .sort((p0, p1) => (p0.totalLiquidityUSD > p1.totalLiquidityUSD ? -1 : 1))
  }, [combinedPools, value])

  const onDismiss = () => {
    setPairsShown(3)
    setTokensShown(3)
    toggleMenu(false)
    setValue('')
  }

  // fetch data based on search input
  useEffect(() => {
    async function fetch() {
      try {
        // const tokens = await DataService.tokens.searchToken(value ? value.toUpperCase() : '', value)
        // const pools = await DataService.pairs.searchPair(
        //   // @ts-ignore
        //   tokens.data.asSymbol?.map(t => t.id),
        //   value
        //   )
        // FIXME: research this feature
        const tokens: any = { data: undefined }
        const pools: any = { data: undefined }

        if (tokens.data) {
          setTokenData([...tokens.data.asAddress, ...tokens.data.asName, ...tokens.data.asSymbol])
        }
        if (pools.data) {
          setPoolData([...pools.data.asAddress, ...pools.data.as0, ...pools.data.as1])
        }
      } catch (error) {
        console.error(error)
      }
    }
    // TODO: temporary search token & pairs by API only in ETH blockchain
    if (value && value.length > 0 && activeNetwork === SupportedNetwork.ETHEREUM) {
      fetch()
    }
  }, [value, activeNetwork])

  useOnClickOutside(wrapperReference, () => {
    setPairsShown(3)
    setTokensShown(3)
    toggleMenu(false)
  })

  return (
    <Container ref={wrapperReference}>
      <Wrapper
        open={showMenu}
        onClick={() => {
          if (!showMenu) {
            toggleMenu(true)
          }
        }}
      >
        <Input
          type="text"
          placeholder={t('searchPairsAndTokens')}
          value={value}
          onChange={event => {
            setValue(event.target.value)
          }}
        />
        {showMenu ? <CloseIcon onClick={onDismiss} /> : <SearchIconLarge />}
      </Wrapper>
      <Menu hide={!showMenu}>
        <Heading>
          <Gray>{t('pairs')}</Gray>
        </Heading>
        <div>
          {poolForList.length === 0 ? (
            <MenuItem>
              <TYPE.body>{t('noResults')}</TYPE.body>
            </MenuItem>
          ) : (
            poolForList.slice(0, pairsShown).map(pair => (
              <BasicLink to={formatPath(`/pairs/${pair.id}`)} key={pair.id} onClick={onDismiss}>
                <MenuItem>
                  <DoubleTokenLogo a0={pair?.tokenOne?.id} a1={pair?.tokenTwo?.id} margin={true} />
                  <TYPE.body style={{ marginLeft: '10px' }}>
                    {pair.tokenOne.symbol + '-' + pair.tokenTwo.symbol}
                  </TYPE.body>
                </MenuItem>
              </BasicLink>
            ))
          )}
          <Heading hide={!(poolForList.length > 3 && poolForList.length >= pairsShown)}>
            <Blue
              onClick={() => {
                setPairsShown(pairsShown + 5)
              }}
            >
              {t('seeMore')}
            </Blue>
          </Heading>
        </div>
        <Heading>
          <Gray>{t('tokens')}</Gray>
        </Heading>
        <div>
          {tokensForList.length === 0 ? (
            <MenuItem>
              <TYPE.body>{t('noResults')}</TYPE.body>
            </MenuItem>
          ) : (
            tokensForList.slice(0, tokensShown).map(token => (
              <BasicLink to={formatPath(`/tokens/${token.id}`)} key={token.id} onClick={onDismiss}>
                <MenuItem>
                  <RowFixed>
                    <TokenLogo address={token.id} style={{ marginRight: '10px' }} />
                    <TokenText text={token.name} maxCharacters={20} style={{ marginRight: '6px' }} />
                    (<TokenText text={token.symbol} maxCharacters={6} />)
                  </RowFixed>
                </MenuItem>
              </BasicLink>
            ))
          )}

          <Heading hide={!(tokensForList.length > 3 && tokensForList.length >= tokensShown)}>
            <Blue
              onClick={() => {
                setTokensShown(tokensShown + 5)
              }}
            >
              {t('seeMore')}
            </Blue>
          </Heading>
        </div>
      </Menu>
    </Container>
  )
}

export default Search
