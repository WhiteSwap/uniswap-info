import { AutoColumn } from 'components/Column'
import Panel from 'components/Panel'
import styled from 'styled-components'

export const Number = styled.p`
  font-size: 3.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary1};
  margin: 0;
`

export const Text = styled.p`
  color: ${({ theme }) => theme.text2};
  white-space: pre-line;
  margin: 0;
  text-align: center;
`

export const Title = styled.p`
  font-size: 2rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text1};
  margin: 0;

  @media screen and (max-width: 440px) {
    font-size: 1.25rem;
  }
`

export const Container = styled(AutoColumn)`
  grid-gap: 1.5rem;
`

export const Card = styled(Panel)`
  padding: 1.5rem;
`
