import styled, { css } from 'styled-components'
import { Bookmark } from 'react-feather'

export const PanelWrapper = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 6px;
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
  grid-template-columns: auto auto auto 1fr;
  column-gap: 30px;
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
      margin-bottom: 1rem;
    }

    &:last-child {
      align-items: start;
      justify-items: start;
    }
  }
`

export const WarningGrouping = styled.div<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => disabled && '0.4'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
`

export const StyledBookmark = styled(Bookmark)<{ $saved: boolean }>`
  color: ${({ theme }) => theme.text1};
  cursor: pointer;
  transition: 0.25s;
  margin-right: 1rem;

  :hover {
    opacity: 0.8;
  }

  ${({ $saved = false, theme }) =>
    $saved &&
    css`
      fill: ${theme.text1};
    `}
`
