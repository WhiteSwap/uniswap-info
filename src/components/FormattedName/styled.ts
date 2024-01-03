import { transparentize } from 'polished'
import styled from 'styled-components'

export const TextWrapper = styled.div<{
  margin?: boolean
  link?: boolean
  fontSize?: string | number
  adjustSize?: boolean
}>`
  position: relative;
  margin-left: ${({ margin }) => margin && '4px'};
  color: ${({ theme, link }) => (link ? theme.blueGrey : transparentize(0.5, theme.text6))};
  font-size: ${({ fontSize }) => fontSize ?? 'inherit'};
  cursor: ${({ link }) => (link ? 'pointer' : 'auto')};

  @media screen and (max-width: 600px) {
    font-size: ${({ adjustSize }) => adjustSize && '10px'};
  }
`
