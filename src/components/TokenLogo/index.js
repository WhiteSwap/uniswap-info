import { useState, useEffect } from 'react'
import { HelpCircle } from 'react-feather'
import styled from 'styled-components/macro'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { getTokenLogoUrl } from 'utils'

const Inline = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
`

const Image = styled.img`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

export default function TokenLogo({ address, size = '24px', alt = 'token', ...rest }) {
  const [error, setError] = useState(false)
  const activeNetworkId = useActiveNetworkId()
  const path = getTokenLogoUrl(activeNetworkId, address)

  useEffect(() => {
    setError(false)
  }, [address])

  if (error || !address) {
    return (
      <Inline>
        <HelpCircle {...rest} alt={alt} size={size} />
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
