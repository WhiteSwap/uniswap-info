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
    height: 3.75rem;
    border-radius: 0.5rem;
  }
`
