import { CustomLink } from 'components/Link'
import { transparentize } from 'polished'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;

  @media screen and (max-width: 440px) {
    margin-top: 0.75rem;
  }
`

export const Arrow = styled.div<{ faded: boolean }>`
  color: ${({ theme }) => theme.primary1};
  opacity: ${({ faded }) => (faded ? 0.3 : 1)};
  padding: 0 1.25rem;
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
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'name liq vol';
  padding: 1rem 2rem;
  border-top: 1px solid ${({ theme }) => theme.bg7};

  > * {
    justify-content: flex-end;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 1.25rem;
    }
  }

  @media screen and (min-width: 740px) {
    padding: 0 1.125rem;
    grid-template-columns: 1.5fr 1fr 1fr;
    grid-template-areas: ' name liq vol';
  }

  @media screen and (min-width: 1080px) {
    padding: 0 1.125rem;
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: ' name liq vol volWeek fees apy';
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: ' name liq vol volWeek fees apy';
  }
`

export const ClickableText = styled(Text)`
  color: ${({ theme }) => transparentize(0.3, theme.text6)};
  user-select: none;
  text-align: end;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;

  @media screen and (max-width: 440px) {
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

  @media screen and (max-width: 440px) {
    font-size: 0.75rem;
  }

  @media screen and (max-width: 600px) {
    font-size: 10px;
  }
`

export const Link = styled(CustomLink)`
  font-size: 14px;
  line-height: 1rem;
  font-weight: 700;
  margin-left: 1.25rem;
  white-space: nowrap;

  > div {
    color: ${({ theme }) => theme.blueGrey} !important;
  }
`
