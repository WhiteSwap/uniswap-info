import { transparentize } from 'polished'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;

  @media screen and (max-width: 440px) {
    margin-top: 0.75rem;
  }
`

export const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

export const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'name liq vol';
  padding: 1rem 2rem;
  border-top: 1px solid ${({ theme }) => theme.bg7};

  > * {
    justify-content: flex-end;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }

  @media screen and (max-width: 440px) {
    padding: 0.75rem;
  }

  @media screen and (min-width: 680px) {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 180px 1fr 1fr 1fr;
    grid-template-areas: 'name symbol liq vol ';

    > * {
      justify-content: flex-end;
      width: 100%;

      &:first-child {
        justify-content: flex-start;
      }
    }
  }

  @media screen and (min-width: 1080px) {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: 1.5fr 0.6fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'name symbol liq vol price change';
  }
`

export const ListWrapper = styled.div``

export const ClickableText = styled(Text)<{ active?: boolean }>`
  color: ${({ theme }) => transparentize(0.3, theme.text6)};
  user-select: none;
  text-align: end;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;

  ${({ active = true }) =>
    active &&
    `
    &:hover {
      opacity: 0.6;
    }
  `}

  @media screen and (max-width: 640px) {
    font-size: 10px;
  }
`

export const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => transparentize(0.5, theme.text6)};

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }

  @media screen and (max-width: 440px) {
    font-size: 10px !important;
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
