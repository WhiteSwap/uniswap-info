import styled from 'styled-components/macro'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`
export const ColumnCenter = styled(Column)`
  width: 100%;
  align-items: center;
`

export const AutoColumn = styled.div<{ gap?: string; justify?: string; margin?: string; marginTop?: string }>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  justify-items: ${({ justify = 'auto' }) => justify};
  margin: ${({ margin = '0' }) => margin};
  margin-top: ${({ marginTop = '0' }) => marginTop};
`

export default Column
