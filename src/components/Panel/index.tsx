import { Box as RebassBox } from 'rebass'
import styled from 'styled-components'

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
`

export default Panel
