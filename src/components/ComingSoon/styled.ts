import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Chart = styled.img`
  width: 100%;
  height: 100%;
  filter: blur(6px);
  border-radius: 0.6rem;
`
export const Title = styled.span`
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  position: absolute;
  padding: 0.5rem;
  border-radius: 12px;
  color: ${({ theme }) => theme.white};
  background: #570a242b;

  @media screen and (max-width: 600px) {
    font-size: 1.25rem;
  }
`
