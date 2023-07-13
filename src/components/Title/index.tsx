import { useFormatPath } from 'hooks'
import { useAppSelector } from 'state/hooks'
import { TitleWrapper } from './styled'

export default function Title() {
  const formatPath = useFormatPath()
  const isDarkMode = useAppSelector(state => state.user.darkMode)

  return (
    <TitleWrapper to={formatPath('/')}>
      <img src={isDarkMode ? '/logo.svg' : '/logo-light-mode.svg'} alt="WhiteSwap logo" />
    </TitleWrapper>
  )
}
