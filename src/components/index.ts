import { Star, ExternalLink } from 'react-feather'
import { Box } from 'rebass'
import styled from 'styled-components'

const Divider = styled(Box)`
  height: 1px;
  background-color: ${({ theme }) => theme.divider};

  &:last-child {
    display: none;
  }
`

export const IconWrapper = styled.div`
  position: absolute;
  right: 0;
  border-radius: 3px;
  height: 1rem;
  width: 1rem;
  padding: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text1};

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

export const Hover = styled.div<{ $fade?: boolean }>`
  :hover {
    cursor: pointer;
    opacity: ${({ $fade }) => $fade && '0.7'};
  }
`

export const StyledIcon = styled.div`
  color: ${({ theme }) => theme.text1};
`

const EmptyCard = styled.div<{ height?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12.5rem;
  border-radius: 1.25rem;
  color: ${({ theme }) => theme.text1};
  height: ${({ height }) => height};
`

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 2.25rem;
  padding-bottom: 5rem;
  background: ${({ theme }) => theme.bg7};
  min-height: 100vh;

  @media screen and (max-width: 600px) {
    & > * {
      padding: 0 0.75rem;
    }
  }
`

export const ContentWrapper = styled.div`
  display: grid;
  justify-content: start;
  align-items: start;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  max-width: 90rem;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;

  @media screen and (max-width: 1180px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
`

export const ContentWrapperLarge = styled.div`
  display: grid;
  justify-content: start;
  align-items: start;
  grid-template-columns: 1fr;
  grid-gap: 1.5rem;
  padding: 0 2rem;
  margin: 0 auto;
  box-sizing: border-box;
  max-width: 90rem;
  width: 100%;

  @media screen and (max-width: 1282px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
`

export const FullWrapper = styled.div`
  display: grid;
  justify-content: start;
  align-items: start;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  max-width: 90rem;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;

  @media screen and (max-width: 1180px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
`

export const StarIcon = styled(Star)<{ $filled: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  color: ${({ theme }) => theme.text1};
  cursor: pointer;
  transition: 0.25s;
  fill: ${({ theme, $filled }) => $filled && theme.text1};

  :hover {
    opacity: 0.8;
  }
`

export const ExternalLinkIcon = styled(ExternalLink)`
  width: 1.25rem;
  height: 1.25rem;
  color: ${({ theme }) => theme.text1};
  cursor: pointer;
  transition: 0.25s opacity;

  :hover {
    opacity: 0.8;
  }
`

export { Divider, EmptyCard }
