import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import { AutoColumn } from 'components/Column'
import {
  SocialLinksList,
  SocialLinkItem,
  LatestBlockContainer,
  LatestBlockText,
  LatestBlock,
  LatestBlockDot
} from 'components/Navigation/styled.ts'
import Row, { AutoRow, FooterRow } from 'components/Row'
import Toggle from 'components/Toggle'
import { useActiveNetworkId, useLatestBlock } from 'state/features/application/selectors'
import { useDarkModeManager } from 'state/features/user/hooks'
import { FooterWrapper } from './styled'

const socialLinks = [
  {
    url: 'https://ws.exchange',
    name: 'WS.exchange'
  },
  {
    url: 'https://docs.ws.exchange',
    name: 'Doc'
  },
  {
    url: 'https://t.me/whiteswapfinance',
    name: 'Telegram'
  },
  {
    url: 'https://discord.com/invite/WDpFBmVJsx',
    name: 'Discord'
  },
  {
    url: 'https://twitter.com/WhiteSwapFi',
    name: 'Twitter'
  }
]

function MobileFooter() {
  const { t } = useTranslation()
  const below768 = useMedia('(max-width: 768px)')
  const [isDark, toggleDarkMode] = useDarkModeManager()
  const latestBlock = useLatestBlock()

  return (
    <FooterWrapper>
      <AutoRow justify="space-between" padding="1.5rem 0">
        <SocialLinksList>
          {socialLinks.map(link => (
            <SocialLinkItem key={link.name}>
              <a target="_blank" rel="noopener noreferrer nofollow" href={link.url}>
                {link.name}
              </a>
            </SocialLinkItem>
          ))}
        </SocialLinksList>
        {below768 ? (
          <FooterRow>
            <Toggle isActive={isDark} toggle={toggleDarkMode} />
            <LatestBlockContainer to="/">
              <LatestBlockText>{t('latestBlock')}</LatestBlockText>
              <LatestBlock>{latestBlock}</LatestBlock>
              <LatestBlockDot />
            </LatestBlockContainer>
          </FooterRow>
        ) : (
          <>
            <Toggle isActive={isDark} toggle={toggleDarkMode} />
            <LatestBlockContainer to="/">
              <LatestBlockText>{t('latestBlock')}</LatestBlockText>
              <LatestBlock>{latestBlock}</LatestBlock>
              <LatestBlockDot />
            </LatestBlockContainer>
          </>
        )}
      </AutoRow>
    </FooterWrapper>
  )
}

export default MobileFooter
