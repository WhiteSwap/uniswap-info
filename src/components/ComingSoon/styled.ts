import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background-color: #47192b29;
  overflow: hidden;
`

export const Chart = styled.img`
  width: 100%;
  height: 100%;
  filter: blur(6px);
  border-radius: 0.6rem;
  transform: scale(1.5);
`
export const Title = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  position: absolute;
  color: ${({ theme }) => theme.white};

  @media screen and (max-width: 600px) {
    font-size: 1.25rem;
  }
`
