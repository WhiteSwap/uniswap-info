import { darken } from 'polished'
import { Menu } from 'react-feather'
import { NavLink, Link as RouterLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

export const Aside = styled.aside`
  height: 100vh;
  background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  color: ${({ theme }) => theme.text1};
  position: sticky;
  top: 0;
  z-index: 9999;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid ${({ theme }) => theme.mercuryGray};
  color: ${({ theme }) => theme.bg2};
  border-bottom: 1px solid ${({ theme }) => theme.mercuryGray};
`

export const Badge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  background-color: rgba(102, 129, 167, 0.1);
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.blueGrey};
`

export const Header = styled.header`
  background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  width: 100%;
  padding: 0 1rem;
  top: 0;
  z-index: 9999;
  display: grid;
  justify-content: space-between;
  align-items: center;
  grid-template-columns: 1fr min-content min-content;
  gap: 1rem;
  position: fixed;
  height: 4.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.mercuryGray};
`

export const SocialLinksList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-auto-flow: row;
  grid-gap: 0.5rem;
`

export const SocialLinkItem = styled.li`
  font-size: 0.825rem;
  opacity: 0.8;
  display: flex;
  justify-self: flex-start;

  a {
    color: ${({ theme }) => theme.text1};
  }

  :hover {
    opacity: 1;
  }
`

export const LatestBlockContainer = styled(RouterLink)`
  align-items: center;
  display: grid;
  width: fit-content;
  grid-auto-flow: column;
  gap: 0.25rem;
  text-decoration: none;
  border-radius: 0.25rem;
  padding: 0.25rem;
  font-weight: 500;
  font-size: 11px;
  transition: opacity 0.25s ease 0s;
`

export const LatestBlockDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.green1};
`

export const LatestBlock = styled.span`
  color: ${({ theme }) => theme.green1};
`

export const LatestBlockText = styled.span`
  color: ${({ theme }) => theme.text3};
`

export const MenuWrapper = styled.div`
  position: relative;
  height: 2rem;
`

export const MenuButton = styled(Menu)`
  width: 2rem;
  height: 2rem;
  color: ${({ theme }) => theme.text2};
  cursor: pointer;
`

export const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  @media screen and (max-width: 1080px) {
    position: absolute;
    width: 200px;
    display: grid;
    grid-auto-flow: row;
    grid-gap: 0.5rem;
    padding: 0.5rem;
    transition: 0.2s ease;
    transform: translate(calc(2.5rem - 100%), 16px);
    border: 1px solid ${({ theme }) => theme.mercuryGray};
    animation: 0.3s ease-in-out;
    background-color: ${({ theme }) => darken(0.05, theme.bg1)};
    border-radius: 0 0 0.5rem 0.5rem;
  }
`

export const IconContainer = styled.div`
  display: flex;
  margin-right: 0.5rem;

  @media screen and (min-width: 1080px) {
    margin-right: 1rem;
    padding: 8px;
    border-radius: 100%;
  }
`

export const MenuItemLink = styled(NavLink)<{ disabled?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0.5rem 0 0.5rem 1.5rem;
  color: ${({ theme }) => theme.text1};
  opacity: 0.6;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;

  :hover {
    opacity: 1;
  }

  &.active {
    opacity: 1;
    color: ${({ theme }) => theme.blueGrey};
    background: rgba(102, 129, 167, 0.1);
    font-weight: 700;

    @media screen and (min-width: 1080px) {
      ${IconContainer} {
        background: ${({ theme }) => theme.blueGrey};
      }

      svg {
        stroke: ${({ theme }) => theme.lightText1};
      }

      :before {
        content: '';
        position: absolute;
        width: 0.25rem;
        height: 100%;
        top: 0;
        left: 0;
        background: ${({ theme }) => theme.blueGrey};
      }
    }
  }

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 1;
      color: ${({ theme }) => theme.text4};
    `}

  @media screen and (max-width: 1080px) {
    opacity: 0.9;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;

    :hover {
      background-color: ${({ theme }) => theme.bg1};
      opacity: 1;
    }
  }
`

export const MenuItem = styled.li`
  width: 100%;
  display: flex;
`
