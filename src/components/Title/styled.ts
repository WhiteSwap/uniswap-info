import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const TitleWrapper = styled(Link)`
  cursor: pointer;

  @media screen and (min-width: 1080px) {
    margin: 1.5rem 2rem;
  }

  img {
    max-width: 100%;
  }
`
