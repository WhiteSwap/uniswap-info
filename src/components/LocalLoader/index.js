import styled, { css, keyframes } from 'styled-components/macro'
import { useDarkModeManager } from '../../contexts/LocalStorage'

const pulse = keyframes`
  0% { transform: scale(1); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

const Wrapper = styled.div`
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  ${props =>
    props.fill && !props.height
      ? css`
          height: 100vh;
        `
      : css`
          height: 180px;
        `}
`

const AnimatedImg = styled.div`
  animation: ${pulse} 800ms linear infinite;
  & > * {
    width: 72px;
  }
`

const LocalLoader = ({ fill }) => {
  const [darkMode] = useDarkModeManager()
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const src = require(darkMode ? 'assets/logo_white.svg' : 'assets/logo.svg').default
  return (
    <Wrapper fill={fill}>
      <AnimatedImg>
        <img src={src} alt="loading-icon" />
      </AnimatedImg>
    </Wrapper>
  )
}

export default LocalLoader
