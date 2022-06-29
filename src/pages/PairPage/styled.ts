import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components/macro'
import Panel from 'components/Panel'

export const PanelWrapper = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 14px;
  display: inline-grid;
  width: 100%;
  align-items: start;

  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      grid-column: 1 / 4;
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }
`

export const TokenDetailsLayout = styled.div`
  display: inline-grid;
  width: 100%;
  grid-template-columns: auto auto auto auto 1fr;
  column-gap: 60px;
  align-items: start;

  &:last-child {
    align-items: center;
    justify-items: end;
  }
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;

    > * {
      grid-column: 1 / 4;
      margin-bottom: 1.5rem;
    }

    &:last-child {
      align-items: start;
      justify-items: start;
    }
  }
`

export const FixedPanel = styled(Panel)`
  width: fit-content;
  padding: 0;
  border: 0;
  background: unset;
  cursor: pointer;
  box-shadow: unset;
`

export const TokenSymbolLink = styled(RouterLink)`
  color: ${({ theme }) => theme.text1};

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

export const WarningGrouping = styled.div<{ disabled: boolean }>`
  opacity: ${({ disabled }) => disabled && '0.4'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
`

export const TokenLink = styled(RouterLink)`
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

export const ActionsContainer = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-auto-flow: column;
  align-items: center;

  @media screen and (max-width: 600px) {
    margin-top: 0.5rem;
  }
`
