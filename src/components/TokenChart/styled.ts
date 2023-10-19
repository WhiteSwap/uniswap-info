import styled from 'styled-components'
import { OptionButton } from 'components/ButtonStyled'

export const ChartButtonsGrid = styled.div`
  display: grid;
  grid-template:
    'a b' auto
    'c d' auto;
  gap: 0.5rem;
`

export const ChartWrapper = styled.div<{ position?: string }>`
  position: ${({ position = 'static' }) => position};
  height: 100%;
  min-height: 300px;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`

export const PriceOption = styled(OptionButton)`
  border-radius: 2px;
`
