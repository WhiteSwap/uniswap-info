import { useState, useEffect, ImgHTMLAttributes } from 'react'
import { HelpCircle } from 'react-feather'
import styled, { css } from 'styled-components/macro'
import { SUPPORTED_NETWORK_VERSIONS } from 'constants/networks'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { getTokenLogoUrl } from 'utils'

const Inline = styled.div<{ covered: boolean; sizeraw: number }>`
  display: flex;
  align-items: center;
  align-self: center;
  ${({ covered, sizeraw }) =>
    covered
      ? css`
          position: absolute;
          left: ${(sizeraw / 1.35).toString() + 'px'};
        `
      : ''}
`

const Image = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

interface ITokenLogoProperties extends ImgHTMLAttributes<HTMLImageElement> {
  address?: string
  size?: string
  covered?: boolean
  sizeraw?: number
}

export default function TokenLogo({
  address,
  size = '24px',
  alt = 'token',
  covered = false,
  sizeraw = 0,
  ...rest
}: ITokenLogoProperties) {
  const [error, setError] = useState(false)
  const activeNetworkId = useActiveNetworkId()
  const path = address ? getTokenLogoUrl(activeNetworkId, address) : undefined
  const networkInfo = SUPPORTED_NETWORK_VERSIONS.find(supportedNetwork => supportedNetwork.id === activeNetworkId)

  useEffect(() => {
    setError(false)
  }, [address])

  if (error || !address) {
    return (
      <Inline covered={covered} sizeraw={sizeraw}>
        <HelpCircle size={size} color={networkInfo?.primaryColor} />
      </Inline>
    )
  }

  return (
    <Inline covered={covered} sizeraw={sizeraw}>
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
