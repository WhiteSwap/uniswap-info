import styled from 'styled-components'
import TokenLogo from 'components/TokenLogo'

const TokenWrapper = styled.div<{ sizeraw: number; margin: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
`

interface IDoubleTokenLogoProperties {
  a0?: string
  a1?: string
  size?: number
  margin?: boolean
}

export default function DoubleTokenLogo({ a0, a1, size = 24, margin = false }: IDoubleTokenLogoProperties) {
  return (
    <TokenWrapper sizeraw={size} margin={margin}>
      <TokenLogo address={a0} size={size.toString() + 'px'} />
      <TokenLogo address={a1} size={size.toString() + 'px'} sizeraw={size} covered />
    </TokenWrapper>
  )
}
