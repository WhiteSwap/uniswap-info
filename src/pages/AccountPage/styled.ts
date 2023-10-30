import styled from 'styled-components'
import { Row } from 'components/Row'

export const Header = styled.div``

export const DropdownWrapper = styled.div`
  position: relative;
  border: 1px solid #edeef2;
  border-radius: 0.75rem;
`

export const Flyout = styled.div`
  position: absolute;
  top: 48px;
  left: -1px;
  width: calc(100% + 2px);
  background-color: ${({ theme }) => theme.bg2};
  z-index: 10;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 10px 0;
  border: 1px solid #edeef2;
  border-top: none;
`

export const MenuRow = styled(Row)`
  width: 100%;
  padding: 0.75rem 0;
  padding-left: 0.75rem;

  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg1};
  }
`

export const ActionsContainer = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-auto-flow: column;
  align-items: center;
`
