import { useRef } from 'react'
import { useToggle } from 'react-use'
import { NavigationLink } from 'components/Navigation'
import { useFormatPath } from 'hooks'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { MenuLink } from './MenuLink'
import { MenuWrapper, MenuButton, MenuIcon, MenuList } from './styled'

interface IMobileMenu {
  links: NavigationLink[]
}

const MobileMenu = ({ links }: IMobileMenu) => {
  const activeNetwork = useActiveNetworkId()
  const formatPath = useFormatPath()
  const [isOpen, toggleOpen] = useToggle(false)
  const node = useRef(null)
  useOnClickOutside(node, isOpen ? () => toggleOpen(false) : undefined)

  return (
    <nav>
      <MenuWrapper>
        <MenuButton onClick={toggleOpen} ref={node}>
          <MenuIcon />
        </MenuButton>
        {isOpen ? (
          <MenuList>
            {links.map(({ key, route, Icon, label, isSoon }) => (
              <MenuLink
                showSoonBadge={isSoon?.[activeNetwork]}
                key={key}
                Icon={Icon}
                label={label}
                route={formatPath(route)}
                onClick={toggleOpen}
              />
            ))}
          </MenuList>
        ) : null}
      </MenuWrapper>
    </nav>
  )
}

export default MobileMenu
