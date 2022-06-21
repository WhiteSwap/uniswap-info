import { useFormatPath } from 'hooks'
import { useRef, useState } from 'react'
import { MenuWrapper, MenuButton, MenuList } from './styled'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { MenuLink } from './MenuLink'
import { NavigationLink } from 'components/Navigation'

interface IMobileMenu {
  links: NavigationLink[]
}

const MobileMenu = ({ links }: IMobileMenu) => {
  const activeNetwork = useActiveNetworkId()
  const formatPath = useFormatPath()
  const [isOpen, setIsOpen] = useState(false)
  const node = useRef(null)
  useOnClickOutside(node, isOpen ? () => setIsOpen(false) : undefined)

  return (
    <nav>
      <MenuWrapper>
        <MenuButton onClick={() => setIsOpen(!isOpen)} />
        {isOpen ? (
          <MenuList ref={node}>
            {links.map(({ key, route, Icon, label, isSoon }) => (
              <MenuLink
                showSoonBadge={isSoon?.[activeNetwork]}
                key={key}
                Icon={Icon}
                label={label}
                route={formatPath(route)}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </MenuList>
        ) : null}
      </MenuWrapper>
    </nav>
  )
}

export default MobileMenu
