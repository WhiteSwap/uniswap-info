import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const TitleWrapper = styled(Link)`
  display: inline-flex;
  cursor: pointer;

  @media screen and (min-width: 1080px) {
    margin: 1.5rem 2rem;
  }

  img {
    max-width: 100%;
    border-radius: 0.5rem;
    height: 3.75rem;

    @media screen and (min-width: 1080px) {
      height: auto;
    }
  }
`
