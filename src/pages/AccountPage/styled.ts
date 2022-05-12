import styled, { css } from 'styled-components'
import Row from 'components/Row'
import { Bookmark } from 'react-feather'

export const Header = styled.div``

export const DropdownWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
  border: 1px solid #edeef2;
  border-radius: 12px;
`

export const Flyout = styled.div`
  position: absolute;
  top: 38px;
  left: -1px;
  width: 100%;
  background-color: ${({ theme }) => theme.bg1};
  z-index: 999;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding-top: 4px;
  border: 1px solid #edeef2;
  border-top: none;
`

export const MenuRow = styled(Row)`
  width: 100%;
  padding: 12px 0;
  padding-left: 12px;

  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`

export const Warning = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  padding: 1rem;
  font-weight: 600;
  border-radius: 10px;
  margin-bottom: 1rem;
  width: calc(100% - 2rem);
`

export const StyledBookmark = styled(Bookmark)<{ $saved: boolean }>`
  color: ${({ theme }) => theme.text1};
  cursor: pointer;
  transition: 0.25s;

  :hover {
    opacity: 0.8;
  }

  ${({ $saved = false, theme }) =>
    $saved &&
    css`
      fill: ${theme.text1};
    `}
`
