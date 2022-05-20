import { AutoColumn } from 'components/Column'
import Title from 'components/Title'
import { useMedia } from 'react-use'
import { useFormatPath } from 'hooks'
import { TrendingUp, List, PieChart, Disc } from 'react-feather'
import Link from 'components/Link'
import { useDarkModeManager } from 'state/features/user/hooks'
import Toggle from 'components/Toggle'
import { useTranslation } from 'react-i18next'
import NetworkSwitcher from 'components/NetworkSwitcher'
import {
  HeaderText,
  Header,
  StyledNavButton,
  Aside,
  NavigationLink,
  LatestBlockContainer,
  LatestBlockText,
  LatestBlock,
  LatestBlockDot,
  Badge
} from './styled'
import { useActiveNetworkId, useLatestBlock } from 'state/features/application/selectors'
import { SupportedNetwork } from 'constants/networks'
import MobileMenu from './MobileMenu'

const navigationLinks = [
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
    label: 'sideNav.accounts'
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
      <MobileMenu />
    </Header>
  ) : (
    <Aside>
      <AutoColumn gap="1rem">
        <Title />
        <NetworkSwitcher />
        <AutoColumn as="nav" style={{ marginTop: '5.25rem' }}>
          {navigationLinks.map(({ route, key, Icon, label }) => {
            // temporary disable account link for beta version
            const isSoon = key === 'accounts' && activeNetwork === SupportedNetwork.TRON

            return (
              <NavigationLink disabled={isSoon} key={key} to={formatPath(route)}>
                <StyledNavButton>
                  <Icon size={20} />
                </StyledNavButton>
                {t(label)}
                {isSoon ? <Badge>{t('soon')}</Badge> : undefined}
              </NavigationLink>
            )
          })}
        </AutoColumn>
      </AutoColumn>
      <AutoColumn gap=".5rem" style={{ marginLeft: '1.5rem', marginBottom: '1.5rem' }}>
        {socialLinks.map(el => (
          <HeaderText key={el.name}>
            <Link href={el.url} target="_blank">
              {el.name}
            </Link>
          </HeaderText>
        ))}
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
