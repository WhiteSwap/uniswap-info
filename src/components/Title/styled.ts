import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const TitleWrapper = styled(Link)`
  display: inline-flex;
  cursor: pointer;
  margin: 1.5rem 2rem;

  @media screen and (max-width: 1080px) {
    margin: 0;
  }

  img {
    max-width: 100%;
    border-radius: 0.5rem;
    height: 3.75rem;

    @media screen and (max-width: 1080px) {
      height: 4.5rem;
    }
  }
`

export const Title = styled.span<{ marginTop?: string; fontSize?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ fontSize = '2.5rem' }) => fontSize};
  position: absolute;
  color: ${({ theme }) => theme.white};
  margin-top: ${({ marginTop = '0' }) => marginTop};

  @media screen and (max-width: 600px) {
    font-size: 1.25rem;
  }
`
