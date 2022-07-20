import { TrendingUp, List, PieChart, Disc, Icon } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import { AutoColumn } from 'components/Column'
import NetworkSwitcher from 'components/NetworkSwitcher'
import Title from 'components/Title'
import Toggle from 'components/Toggle'
import { SupportedNetwork } from 'constants/networks'
import { useFormatPath } from 'hooks'
import { useActiveNetworkId, useLatestBlock } from 'state/features/application/selectors'
import { useDarkModeManager } from 'state/features/user/hooks'
import { MenuLink } from './MenuLink'
import MobileMenu from './MobileMenu'
import {
  SocialLinksList,
  SocialLinkItem,
  Header,
  Aside,
  LatestBlockContainer,
  LatestBlockText,
  LatestBlock,
  LatestBlockDot,
  MenuList
} from './styled'

export type NavigationLink = {
  key: string
  route: string
  Icon: Icon
  label: string
  isSoon?: { [key in SupportedNetwork]?: boolean }
}

const navigationLinks: NavigationLink[] = [
  {
    key: 'home',
    route: '/',
    Icon: TrendingUp,
    label: 'sideNav.overview'
  },
  {
    key: 'tokens',
    route: '/tokens',
    Icon: Disc,
    label: 'sideNav.tokens'
  },
  {
    key: 'pairs',
    route: '/pairs',
    Icon: PieChart,
    label: 'sideNav.pairs'
  },
  {
    key: 'accounts',
    route: '/accounts',
    Icon: List,
    label: 'sideNav.accounts',
    isSoon: {
      [SupportedNetwork.TRON]: true
    }
  }
]

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
    url: 'https://t.me/whiteswap',
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

function Navigation() {
  const { t } = useTranslation()
  const below1080 = useMedia('(max-width: 1080px)')
  const [isDark, toggleDarkMode] = useDarkModeManager()
  const formatPath = useFormatPath()
  const activeNetwork = useActiveNetworkId()
  const latestBlock = useLatestBlock()

  return below1080 ? (
    <Header>
      <Title />
      <NetworkSwitcher />
      <MobileMenu links={navigationLinks} />
    </Header>
  ) : (
    <Aside>
      <AutoColumn gap="1rem">
        <Title />
        <NetworkSwitcher />
        <AutoColumn as="nav" style={{ marginTop: '5.25rem' }}>
          <MenuList>
            {navigationLinks.map(({ route, key, Icon, label, isSoon }) => (
              <MenuLink
                key={key}
                Icon={Icon}
                label={label}
                route={formatPath(route)}
                showSoonBadge={isSoon?.[activeNetwork]}
              />
            ))}
          </MenuList>
        </AutoColumn>
      </AutoColumn>
      <AutoColumn gap=".5rem" style={{ marginLeft: '1.5rem', marginBottom: '1.5rem' }}>
        <SocialLinksList>
          {socialLinks.map(link => (
            <SocialLinkItem key={link.name}>
              <a target="_blank" rel="noopener noreferrer nofollow" href={link.url}>
                {link.name}
              </a>
            </SocialLinkItem>
          ))}
        </SocialLinksList>
        <Toggle isActive={isDark} toggle={toggleDarkMode} />
        <LatestBlockContainer to="/">
          <LatestBlockText>{t('latestBlock')}</LatestBlockText>
          <LatestBlock>{latestBlock}</LatestBlock>
          <LatestBlockDot />
        </LatestBlockContainer>
      </AutoColumn>
    </Aside>
  )
}

export default Navigation
