import { PropsWithChildren } from 'react'
import { lighten, darken } from 'polished'
import { Link as RouterLink } from 'react-router-dom'
import { Link as RebassLink, LinkProps } from 'rebass'
import styled, { useTheme } from 'styled-components/macro'

type WrappedLinkProperties = PropsWithChildren<{ external?: boolean; color?: string } & LinkProps>

const WrappedLink = ({ external, target, children, ...rest }: WrappedLinkProperties) => {
  const theme = useTheme()

  return (
    <RebassLink
      target={external || !target ? '_blank' : target}
      rel={external ? 'noopener noreferrer' : undefined}
      color={theme.blueGrey}
      {...rest}
    >
      {children}
    </RebassLink>
  )
}

const Link = styled(WrappedLink)`
  color: ${({ color, theme }) => color || theme.link};
  cursor: pointer;
`

export const CustomLink = styled(RouterLink)<{ color?: string }>`
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  color: ${({ color, theme }) => color || theme.blueGrey};
  cursor: pointer;

  &:visited {
    color: ${({ color, theme }) => (color ? lighten(0.1, color) : lighten(0.1, theme.blueGrey))};
  }

  &:hover {
    color: ${({ color, theme }) => (color ? darken(0.1, color) : darken(0.1, theme.blueGrey))};
  }

  @media screen and (max-width: 440px) {
    font-size: 10px !important;
  }
`

export const BasicLink = styled(RouterLink)`
  text-decoration: none;
  color: inherit;

  &:hover {
    cursor: pointer;
    text-decoration: none;
  }
`

export default Link
