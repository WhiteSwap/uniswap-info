import { Link as RebassLink } from 'rebass'
import { Link as RouterLink, LinkProps } from 'react-router-dom'
import styled from 'styled-components/macro'
import { lighten, darken } from 'polished'
import { PropsWithChildren } from 'react'

type WrappedLinkProps = PropsWithChildren<
  {
    external?: boolean
    color?: string
  } & LinkProps
>

const WrappedLink = ({ external, children, ...rest }: WrappedLinkProps) => (
  <RebassLink
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    color="#6681A7"
    {...rest}
  >
    {children}
  </RebassLink>
)

const Link = styled(WrappedLink)`
  color: ${({ color, theme }) => (color ? color : theme.link)};
`

export const CustomLink = styled(RouterLink)<{ color?: string }>`
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  color: ${({ color, theme }) => (color ? color : theme.blueGrey)};
  cursor: pointer;
  white-space: 'nowrap';

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
