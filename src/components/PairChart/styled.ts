import styled from 'styled-components'

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
  margin-bottom: 2.5rem;
`
