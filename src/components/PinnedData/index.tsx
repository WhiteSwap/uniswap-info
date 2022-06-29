import { Bookmark, ChevronRight, X } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Hover } from 'components'
import AccountSearch from 'components/AccountSearch'
import { ButtonFaded } from 'components/ButtonStyled'
import { AutoColumn } from 'components/Column'
import FormattedName from 'components/FormattedName'
import { RowBetween, RowFixed } from 'components/Row'
import TokenLogo from 'components/TokenLogo'
import { useFormatPath } from 'hooks'
import { useSavedTokens, useSavedPairs } from 'state/features/user/hooks'
import { TYPE } from 'Theme'
import { RightColumn, SavedButton, ScrollableDiv, StyledIcon } from './styled'

interface IPinnedData {
  open: boolean
  setSavedOpen: (value: boolean) => void
}

const PinnedData = ({ open, setSavedOpen }: IPinnedData) => {
  const { t } = useTranslation()
  const formatPath = useFormatPath()

  const [savedPairs, , removePair] = useSavedPairs()
  const [savedTokens, , removeToken] = useSavedTokens()

  if (!open) {
    return (
      <RightColumn open={open} onClick={() => setSavedOpen(true)}>
        <SavedButton open={open}>
          <StyledIcon>
            <Bookmark size={20} />
          </StyledIcon>
        </SavedButton>
      </RightColumn>
    )
  }

  return (
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
      <AccountSearch small={true} />
      <AutoColumn gap="40px" style={{ marginTop: '2rem' }}>
        <AutoColumn gap="12px">
          <TYPE.main>{t('pinnedPairs')}</TYPE.main>
          {Object.keys(savedPairs).length > 0 ? (
            Object.values(savedPairs).map(pair => (
              <RowBetween key={pair.address}>
                <ButtonFaded as={Link} to={formatPath(`/pairs/${pair.address}`)}>
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
            ))
          ) : (
            <TYPE.light>{t('pinnedPairsHere')}</TYPE.light>
          )}
        </AutoColumn>
        <ScrollableDiv gap="12px">
          <TYPE.main>{t('pinnedTokens')}</TYPE.main>
          {Object.keys(savedTokens).length > 0 ? (
            Object.keys(savedTokens).map(address => {
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
