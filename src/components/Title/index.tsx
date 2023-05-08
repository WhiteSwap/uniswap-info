import { useFormatPath } from 'hooks'
import { TitleWrapper } from './styled'

export default function Title() {
  const formatPath = useFormatPath()

  return (
    <TitleWrapper to={formatPath('/')}>
      <img src="/logo.svg" alt="WhiteSwap logo" />
    </TitleWrapper>
  )
}
