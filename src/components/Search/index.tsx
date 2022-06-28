import { useState, useEffect, useMemo, useRef } from 'react'

import { RowFixed } from '../Row'
import TokenLogo from '../TokenLogo'
import { BasicLink } from '../Link'

import { useFormatPath } from 'hooks'
import DoubleTokenLogo from '../DoubleLogo'
import { TYPE } from '../../Theme'
import { escapeRegExp, isValidAddress } from 'utils'
import { useTranslation } from 'react-i18next'
import { useTokens } from 'state/features/token/selectors'
import { usePairs } from 'state/features/pairs/selectors'
import DataService from 'data/DataService'
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
import { TokenDetails } from 'state/features/token/types'
import { PairDetails } from 'state/features/pairs/types'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { SupportedNetwork } from 'constants/networks'

export const Search = () => {
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
        return regexMatches.some(m => m)
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
          if (key === 'id' && isAddress) {
            return t[key].match(new RegExp(escapeRegExp(value), 'i'))
          }
          if ((key === 'tokenOne' || key === 'tokenTwo') && !isAddress) {
            return (
              t[key].name.match(new RegExp(escapeRegExp(value), 'i')) ||
              t[key].symbol.toLocaleLowerCase().match(new RegExp(escapeRegExp(value.toLocaleLowerCase()), 'i'))
            )
          }
          return false
        })
        return regexMatches.some(m => m)
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
        const tokens = await DataService.tokens.searchToken(value ? value.toUpperCase() : '', value)
        const pools = await DataService.pairs.searchPair(
          // @ts-ignore
          tokens.data.asSymbol?.map(t => t.id),
          value
        )

        if (tokens.data) {
          setTokenData([...tokens.data.asAddress, ...tokens.data.asName, ...tokens.data.asSymbol])
        }
        if (pools.data) {
          setPoolData([...pools.data.asAddress, ...pools.data.as0, ...pools.data.as1])
        }
      } catch (error) {
        console.log(error)
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
        {!showMenu ? <SearchIconLarge /> : <CloseIcon onClick={onDismiss} />}
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
                    {pair.tokenOne.symbol + '-' + pair.tokenTwo.symbol} {t('pair')}
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
