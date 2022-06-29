import styled from 'styled-components/macro'
import { AutoColumn } from 'components/Column'
import { RowBetween } from 'components/Row'

export const RightColumn = styled.div<{ open?: boolean }>`
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: ${({ open }) => (open ? '12.5rem' : '4rem')};
  padding: 1.25rem;
  border-left: ${({ theme }) => '1px solid' + theme.bg3};
  background-color: ${({ theme }) => theme.bg1};
  z-index: 9999;
  overflow: auto;
`

export const SavedButton = styled(RowBetween)<{ open?: boolean }>`
  padding-bottom: ${({ open }) => open && '20px'};
  border-bottom: ${({ theme, open }) => open && '1px solid' + theme.bg3};
  margin-bottom: ${({ open }) => open && '1.25rem'};

  :hover {
    cursor: pointer;
  }
`

export const ScrollableDiv = styled(AutoColumn)`
  overflow: auto;
  padding-bottom: 60px;
`

export const StyledIcon = styled.div`
  color: ${({ theme }) => theme.text2};
`
