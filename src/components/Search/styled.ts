import FormattedName from 'components/FormattedName'
import Row from 'components/Row'
import { transparentize } from 'polished'
import { Search, X } from 'react-feather'
import styled from 'styled-components'

export const Container = styled.div`
  height: 48px;
  z-index: 30;
  position: relative;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`

export const Wrapper = styled.div<{ open?: boolean }>`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem1rem;
  border-radius: 0.75rem;
  background: ${({ theme }) => transparentize(0.4, theme.bg6)};
  border-bottom-right-radius: ${({ open }) => (open ? '0px' : '12px')};
  border-bottom-left-radius: ${({ open }) => (open ? '0px' : '12px')};
  border: 1px solid ${({ theme }) => theme.bg7};
  z-index: 9999;
  width: 100%;
  min-width: 300px;
  box-sizing: border-box;

  @media screen and (max-width: 500px) {
    background: ${({ theme }) => transparentize(0.4, theme.bg1)};
  }
`
export const Input = styled.input`
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  width: 100%;
  color: ${({ theme }) => theme.text1};
  font-size: 1rem;

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 1rem;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

export const SearchIconLarge = styled(Search)`
  height: 1.25rem;
  width: 1.25rem;
  color: ${({ theme }) => theme.text3};
  pointer-events: none;
`

export const CloseIcon = styled(X)`
  height: 1.25rem;
  width: 1.25rem;
  color: ${({ theme }) => theme.text3};
  cursor: pointer;
`

export const Menu = styled.div<{ hide?: boolean }>`
  display: flex;
  flex-direction: column;
  z-index: 9999;
  width: 100%;
  top: 50px;
  max-height: 540px;
  overflow: auto;
  left: 0;
  padding-bottom: 1.25rem;
  background: ${({ theme }) => theme.bg6};
  border-bottom-right-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.04), 0 0.25rem 0.5rem rgba(0, 0, 0, 0.04), 01rem 1.5rem rgba(0, 0, 0, 0.04),
    0 1.5rem 32px rgba(0, 0, 0, 0.04);
  display: ${({ hide }) => hide && 'none'};
`

export const MenuItem = styled(Row)`
  padding: 1rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text1};

  & > * {
    margin-right: 6px;
  }
  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`

export const TokenText = styled(FormattedName)`
  color: ${({ theme }) => theme.text1};
`

export const Heading = styled(Row)<{ hide?: boolean }>`
  padding: 1rem;
  display: ${({ hide = false }) => hide && 'none'};
`

export const Gray = styled.span`
  color: #888d9b;
`

export const Blue = styled.span`
  color: #2172e5;
  :hover {
    cursor: pointer;
  }
`
