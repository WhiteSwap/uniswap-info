import { transparentize } from 'polished'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'
import Link from 'components/Link'

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

export const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

export const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'txn value time';
  border-top: 1px solid ${({ theme }) => theme.bg7};
  padding: 1rem 2rem;

  > * {
    justify-content: flex-end;
    width: 100%;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }

  @media screen and (min-width: 500px) {
    > * {
      &:first-child {
        width: 180px;
      }
    }
  }

  @media screen and (min-width: 780px) {
    max-width: 1320px;
    grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'txn value amountToken amountOther time';

    > * {
      &:first-child {
        width: 180px;
      }
    }
  }

  @media screen and (min-width: 1080px) {
    max-width: 1320px;
    grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'txn value amountToken amountOther account time';
  }

  @media screen and (max-width: 440px) {
    padding: 0.75rem;
  }
`

export const CustomLink = styled(Link)`
  color: ${({ theme }) => theme.blueGrey};
  font-weight: 600;

  @media screen and (max-width: 440px) {
    font-size: 10px;
  }
`

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

  @media screen and (max-width: 440px) {
    font-size: 10px;
  }
`

export const SortText = styled.button<{ active: boolean }>`
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 500 : 400)};
  margin-right: 0.75rem !important;
  border: none;
  background-color: transparent;
  font-size: 1rem;
  padding: 0px;
  color: ${({ active, theme }) => (active ? theme.text1 : theme.text3)};
  outline: none;

  @media screen and (max-width: 600px) {
    font-size: 14px;
  }

  @media screen and (max-width: 440px) {
    font-size: 10px;
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
