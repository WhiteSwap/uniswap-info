import { useDarkModeManager } from 'state/features/user/hooks'
import { AnimatedImg, Wrapper } from './styled'

interface ILocalLoader {
  fullscreen?: boolean
}

const LocalLoader = ({ fullscreen }: ILocalLoader) => {
  const [darkMode] = useDarkModeManager()
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const source = require(darkMode ? 'assets/logo_white.svg' : 'assets/logo.svg').default

  return (
    <Wrapper fullscreen={fullscreen}>
      <AnimatedImg>
        <img src={source} alt="loading-icon" />
      </AnimatedImg>
    </Wrapper>
  )
}

export default LocalLoader
