import styled from 'styled-components/macro'

export const ChartWrapper = styled.div`
  height: 100%;
  max-height: 340px;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`

export const OptionsRow = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  width: 100%;
  margin-bottom: 40px;
`
