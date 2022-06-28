import { transparentize } from 'polished'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'
import { CustomLink as RouterLink } from 'components/Link'
import { RowFixed } from 'components/Row'

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2em;

  @media screen and (max-width: 440px) {
    margin-top: 0.75rem;
  }
`

export const Arrow = styled.div<{ faded?: boolean }>`
  color: ${({ theme }) => theme.primary1};
  opacity: ${faded => (faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

export const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

export const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 5px 1.4fr 1fr 1fr;
  grid-template-areas: 'number name uniswap return';
  align-items: flex-start;
  padding: 1rem 2rem;
  border-top: 1px solid ${({ theme }) => theme.bg7};

  > * {
    justify-content: flex-end;
    width: 100%;

    :first-child {
      justify-content: flex-start;
      text-align: left;
      width: 20px;
    }
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 35px 2.5fr 1fr 1fr;
    grid-template-areas: 'number name uniswap return';
  }

  @media screen and (max-width: 740px) {
    grid-template-columns: 2.5fr 1fr 1fr;
    grid-template-areas: 'name uniswap return';
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 2.5fr 1fr;
    grid-template-areas: 'name uniswap';
  }

  @media screen and (max-width: 440px) {
    padding: 0.75rem;
  }
`

export const ListWrapper = styled.div``

export const ClickableText = styled(Text)`
  color: ${({ theme }) => transparentize(0.3, theme.text6)};
  user-select: none;
  text-align: end;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }

  @media screen and (max-width: 440px) {
    font-size: 10px;
  }
`

export const CustomLink = styled(RouterLink)`
  color: ${({ theme }) => theme.blueGrey};
  font-weight: 600;
  cursor: pointer;
`

export const DataText = styled(Flex)`
  align-items: center;
  text-align: right;
  color: ${({ theme }) => transparentize(0.5, theme.text6)};

  & > * {
    font-size: 1em;
  }

  @media screen and (max-width: 40em) {
    font-size: 0.85rem;
  }
`

export const ButtonsContainer = styled(RowFixed)`
  @media screen and (max-width: 540px) {
    flex-wrap: wrap;

    > a {
      margin-right: 0;
      margin-top: 0.5rem;

      &:first-child {
        margin-top: 0;
      }
    }
  }
`

export const PaginationButton = styled.button`
  padding: 0.5rem;
  background: transparent;
  color: ${({ theme }) => theme.blueGrey};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: background 0.15s ease-in-out;
  margin: 0 0.5rem;

  &:not([disabled]):hover {
    background: ${({ theme }) => theme.bg2};
  }

  &:disabled {
    color: ${({ theme }) => theme.text4};
    cursor: not-allowed;
  }
`
