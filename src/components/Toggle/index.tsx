import { Sun, Moon } from 'react-feather'
import styled from 'styled-components/macro'

const IconWrapper = styled.div<{ isActive?: boolean }>`
  opacity: ${({ isActive }) => (isActive ? 0.8 : 0.4)};

  > svg {
    fill: ${({ theme }) => theme.text1};
    stroke: ${({ theme }) => theme.text1};
  }

  :hover {
    opacity: 1;
  }
`

const StyledToggle = styled.div`
  display: flex;
  width: fit-content;
  cursor: pointer;
  text-decoration: none;
  // margin-top: 1rem;
  color: white;

  :hover {
    text-decoration: none;
  }

  @media screen and (max-width: 1080px) {
    flex-basis: 8rem;
    justify-content: center;
  }

  @media screen and (max-width: 768px) {
    justify-content: center;
    flex-basis: fit-content;
    margin-top: 0;
  }
`

const Span = styled.span`
  padding: 0 0.5rem;
  color: ${({ theme }) => theme.text1};
`

export interface ToggleProperties {
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ isActive, toggle }: ToggleProperties) {
  return (
    <StyledToggle onClick={toggle}>
      <span>
        <IconWrapper isActive={!isActive}>
          <Sun size={20} />
        </IconWrapper>
      </span>
      <Span>{' / '}</Span>
      <span>
        <IconWrapper isActive={isActive}>
          <Moon size={20} />
        </IconWrapper>
      </span>
    </StyledToggle>
  )
}
