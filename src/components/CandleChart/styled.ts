import styled from 'styled-components'

export const ChartWrapper = styled.div`
  position: relative;
`

export const IconWrapper = styled.div`
  position: absolute;
  right: 0.625rem;
  color: ${({ theme }) => theme.text1};
  border-radius: 3px;
  height: 1rem;
  width: 1rem;
  padding: 0;
  bottom: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`
