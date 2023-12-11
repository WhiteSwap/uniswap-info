import { useTranslation } from 'react-i18next'
import { NavigationLink } from 'components/Navigation'
import { Badge, IconContainer, MenuItem, MenuItemLink } from './styled'

interface IMenuLink extends NavigationLink {
  onClick?: () => void
  showSoonBadge?: boolean
}

export const MenuLink = ({ route, Icon, label, onClick, showSoonBadge }: IMenuLink) => {
  const { t } = useTranslation()

  return (
    <MenuItem>
      <MenuItemLink disabled={showSoonBadge} to={route} onClick={onClick}>
        <IconContainer>
          <Icon />
        </IconContainer>
        {t(label) as string}
        {showSoonBadge ? <Badge>{t('soon')}</Badge> : undefined}
      </MenuItemLink>
    </MenuItem>
  )
}
