import { FallbackRender } from '@sentry/react/types/errorboundary'
import { PageWrapper, ContentWrapper } from 'components'
import { ButtonDark } from 'components/ButtonStyled'
import { Container, Title, Number, Card, Text } from './styled'

const FallbackError: FallbackRender = ({ resetError }) => {
  return (
    <PageWrapper>
      <ContentWrapper>
        <Card>
          <Container gap={'md'} justify="center">
            <Number>500</Number>
            <Title>Internal Server Error</Title>
            <Text>{'Oops something went wrong.\nWe are working on fixing the problem.'}</Text>
            <ButtonDark as="a" href={window.location.origin} onClick={resetError}>
              Back to Home
            </ButtonDark>
          </Container>
        </Card>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default FallbackError
