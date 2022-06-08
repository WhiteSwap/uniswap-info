import { useFormatPath } from 'hooks'
import { useRef, useState } from 'react'
import { MenuWrapper, MenuButton, MenuList, Badge, MenuItemLink, MenuItemName } from './styled'
import { TrendingUp, List, PieChart, Disc } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { SupportedNetwork } from 'constants/networks'

const MENU_LINKS = [
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

const MobileMenu = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const activeNetwork = useActiveNetworkId()
  const formatPath = useFormatPath()

  const node = useRef(null)
  useOnClickOutside(node, isOpen ? () => setIsOpen(false) : undefined)

  return (
    <MenuWrapper>
      <MenuButton onClick={() => setIsOpen(!isOpen)} />
      {isOpen ? (
        <MenuList ref={node}>
          {MENU_LINKS.map(({ key, route, Icon, label }) => {
            // temporary disable account link for beta version
            const isSoon = key === 'accounts' && activeNetwork === SupportedNetwork.TRON

            return (
              <MenuItemLink disabled={isSoon} key={key} to={formatPath(route)} onClick={() => setIsOpen(false)}>
                <Icon />
                <MenuItemName>{t(label)}</MenuItemName>
                {isSoon ? <Badge>{t('soon')}</Badge> : undefined}
              </MenuItemLink>
            )
          })}
        </MenuList>
      ) : null}
    </MenuWrapper>
  )
}

export default MobileMenu
