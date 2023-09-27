import { useState, useEffect, ImgHTMLAttributes } from 'react'
import { HelpCircle } from 'react-feather'
import styled from 'styled-components/macro'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { getTokenLogoUrl } from 'utils'

const Inline = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
`

const Image = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

interface ITokenLogoProperties extends ImgHTMLAttributes<HTMLImageElement> {
  address: string
  size?: string
}

export default function TokenLogo({ address, size = '24px', alt = 'token', ...rest }: ITokenLogoProperties) {
  const [error, setError] = useState(false)
  const activeNetworkId = useActiveNetworkId()
  const path = getTokenLogoUrl(activeNetworkId, address)

  useEffect(() => {
    setError(false)
  }, [address])

  if (error || !address) {
    return (
      <Inline>
        <HelpCircle size={size} />
      </Inline>
    )
  }

  return (
    <Inline>
      <Image
        {...rest}
        alt={alt}
        src={path}
        size={size}
        onError={event => {
          setError(true)
          event.preventDefault()
        }}
      />
    </Inline>
  )
}
