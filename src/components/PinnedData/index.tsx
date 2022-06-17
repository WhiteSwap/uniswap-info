import { Link } from 'react-router-dom'
import { RowBetween, RowFixed } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'Theme'
import { useSavedTokens, useSavedPairs } from 'state/features/user/hooks'
import { useFormatPath } from 'hooks'
import { Hover } from 'components'
import TokenLogo from 'components/TokenLogo'
import AccountSearch from 'components/AccountSearch'
import { Bookmark, ChevronRight, X } from 'react-feather'
import { ButtonFaded } from 'components/ButtonStyled'
import FormattedName from 'components/FormattedName'
import { useTranslation } from 'react-i18next'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { SupportedNetwork } from 'constants/networks'
import { RightColumn, SavedButton, ScrollableDiv, StyledIcon } from './styled'

type Props = {
  open: boolean
  setSavedOpen: (value: boolean) => void
}

const PinnedData = ({ open, setSavedOpen }: Props) => {
  const { t } = useTranslation()
  const formatPath = useFormatPath()
  const activeNetwork = useActiveNetworkId()

  const [savedPairs, , removePair] = useSavedPairs()
  const [savedTokens, , removeToken] = useSavedTokens()

  return !open ? (
    <RightColumn open={open} onClick={() => setSavedOpen(true)}>
      <SavedButton open={open}>
        <StyledIcon>
          <Bookmark size={20} />
        </StyledIcon>
      </SavedButton>
    </RightColumn>
  ) : (
    <RightColumn open={open}>
      <SavedButton onClick={() => setSavedOpen(false)} open={open}>
        <RowFixed>
          <StyledIcon>
            <Bookmark size={16} />
          </StyledIcon>
          <TYPE.main ml="4px">{t('saved')}</TYPE.main>
        </RowFixed>
        <StyledIcon>
          <ChevronRight />
        </StyledIcon>
      </SavedButton>
      {activeNetwork !== SupportedNetwork.TRON ? <AccountSearch small={true} /> : null}
      <AutoColumn gap="40px" style={{ marginTop: '2rem' }}>
        <AutoColumn gap="12px">
          <TYPE.main>{t('pinnedPairs')}</TYPE.main>
          {Object.keys(savedPairs).filter(key => {
            return Boolean(savedPairs[key])
          }).length > 0 ? (
            Object.keys(savedPairs)
              .filter(address => {
                return Boolean(savedPairs[address])
              })
              .map(address => {
                const pair = savedPairs[address]
                return (
                  <RowBetween key={pair.address}>
                    <ButtonFaded as={Link} to={formatPath(`/pairs/${address}`)}>
                      <RowFixed>
                        <TYPE.header>
                          <FormattedName
                            text={pair.token0Symbol + '/' + pair.token1Symbol}
                            maxCharacters={12}
                            fontSize={'12px'}
                          />
                        </TYPE.header>
                      </RowFixed>
                    </ButtonFaded>
                    <Hover onClick={() => removePair(pair.address)}>
                      <StyledIcon>
                        <X size={16} />
                      </StyledIcon>
                    </Hover>
                  </RowBetween>
                )
              })
          ) : (
            <TYPE.light>{t('pinnedPairsHere')}</TYPE.light>
          )}
        </AutoColumn>
        <ScrollableDiv gap="12px">
          <TYPE.main>{t('pinnedTokens')}</TYPE.main>
          {Object.keys(savedTokens).filter(key => {
            return Boolean(savedTokens[key])
          }).length > 0 ? (
            Object.keys(savedTokens)
              .filter(address => {
                return Boolean(savedTokens[address])
              })
              .map(address => {
                const token = savedTokens[address]
                return (
                  <RowBetween key={address}>
                    <ButtonFaded as={Link} to={formatPath(`/tokens/${address}`)}>
                      <RowFixed>
                        <TokenLogo address={address} size="14px" />
                        <TYPE.header ml="6px">
                          <FormattedName text={token.symbol} maxCharacters={12} fontSize="12px" />
                        </TYPE.header>
                      </RowFixed>
                    </ButtonFaded>
                    <Hover onClick={() => removeToken(address)}>
                      <StyledIcon>
                        <X size={16} />
                      </StyledIcon>
                    </Hover>
                  </RowBetween>
                )
              })
          ) : (
            <TYPE.light>{t('pinnedTokensHere')}</TYPE.light>
          )}
        </ScrollableDiv>
      </AutoColumn>
    </RightColumn>
  )
}

export default PinnedData
