import { Box as RebassBox } from 'rebass'
import styled, { css } from 'styled-components/macro'

const panelPseudo = css`
  :after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 10px;
  }

  @media only screen and (min-width: 40em) {
    :after {
      content: unset;
    }
  }
`

const Panel = styled(RebassBox)`
  position: relative;
  background-color: ${({ theme }) => theme.advancedBG};
  padding: 1.125rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.bg7};
  cursor: pointer;

  ${props => props.background && `background-color: ${props.theme.advancedBG};`}

  ${props => (props.area ? `grid-area: ${props.area};` : null)}

  ${props =>
    props.grouped &&
    css`
      @media only screen and (min-width: 40em) {
        &:first-of-type {
          border-radius: 1.25rem 1.25rem 0 0;
        }
        &:last-of-type {
          border-radius: 0 0 1.25rem 1.25rem;
        }
      }
    `}

  ${props =>
    props.rounded &&
    css`
      border-radius: 0.5rem;
      @media only screen and (min-width: 40em) {
        border-radius: 10px;
      }
    `};

  ${props => !props.last && panelPseudo}
`

export default Panel
