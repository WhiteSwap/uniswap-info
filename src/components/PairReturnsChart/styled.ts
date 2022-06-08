import styled from 'styled-components/macro'

export const ChartWrapper = styled.div`
  max-height: 420px;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`

export const OptionsRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 40px;
`
