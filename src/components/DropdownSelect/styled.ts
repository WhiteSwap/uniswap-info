import { ChevronDown as Arrow } from 'react-feather'
import styled from 'styled-components'

export const Wrapper = styled.div<{ open: boolean }>`
  z-index: 20;
  position: relative;
  background-color: ${({ theme }) => theme.panelColor};
  border: 1px solid ${({ open, color }) => (open ? color : 'rgba(0, 0, 0, 0.15);')};
  width: 7.5rem;
  padding: 0.25rem 10px;
  padding-right: 6px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer;
  }
`

export const Dropdown = styled.div`
  position: absolute;
  top: 34px;
  padding-top: 2.5rem;
  width: calc(100% - 2.5rem);
  background-color: ${({ theme }) => theme.bg1};
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 0.625rem 0.625rem;
  border-radius: 0.5rem;
  width: 100%;
  font-weight: 500;
  font-size: 1rem;
  color: black;

  :hover {
    cursor: pointer;
  }
`

export const ArrowStyled = styled(Arrow)`
  height: 1.25rem;
  width: 1.25rem;
  margin-left: 6px;
`
