import Lottie from 'lottie-react'
import loaderAnimation from 'assets/loaderAnimation.json'
import { Wrapper } from './styled'

interface ILocalLoader {
  fullscreen?: boolean
}

const LocalLoader = ({ fullscreen }: ILocalLoader) => {
  return (
    <Wrapper fullscreen={fullscreen}>
      <Lottie animationData={loaderAnimation} loop={true} />
    </Wrapper>
  )
}

export default LocalLoader
