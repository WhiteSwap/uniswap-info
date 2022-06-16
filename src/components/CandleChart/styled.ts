import styled from 'styled-components'

export const ChartWrapper = styled.div`
  position: relative;
`

export const TooltipPrice = styled.div`
  font-size: 22px;
  margin: 4px 0px;
  color: ${({ theme }) => theme.text1};
`

export const TimeSpan = styled.span`
  font-size: 12px;
  margin: 4px 6px;
  color: ${({ theme }) => theme.text1};
`

export const IconWrapper = styled.div`
  position: absolute;
  right: 10px;
  color: ${({ theme }) => theme.text1};
  border-radius: 3px;
  height: 16px;
  width: 16px;
  padding: 0px;
  bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`
