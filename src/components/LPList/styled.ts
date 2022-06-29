import { transparentize } from 'polished'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components/macro'

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
  opacity: ${({ faded }) => (faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

export const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

export const CustomText = styled(Text)`
  color: ${({ theme }) => transparentize(0.3, theme.text6)};
  user-select: none;
  text-align: end;
  font-size: 14px;
  font-weight: 500;

  @media screen and (max-width: 440px) {
    font-size: 10px;
  }
`

export const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 10px 1.5fr 1fr 1fr;
  grid-template-areas: 'number name pair value';
  padding: 1rem 2rem;
  border-top: 1px solid ${({ theme }) => theme.bg7};

  > * {
    justify-content: flex-end;
  }

  @media screen and (max-width: 1080px) {
    grid-template-columns: 10px 1.5fr 1fr 1fr;
    grid-template-areas: 'number name pair value';
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 'name pair value';
  }

  @media screen and (max-width: 440px) {
    padding: 0.75rem;
  }
`

export const ListWrapper = styled.div``

export const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  font-weight: 500;
  color: ${({ theme }) => transparentize(0.5, theme.text6)};

  & > * {
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
