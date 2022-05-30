import { ContentWrapper, PageWrapper } from 'components'
import { ButtonDark } from 'components/ButtonStyled'
import React, { ErrorInfo } from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'
import { Number, Title, Text, Container, Card } from './styled'

type ErrorBoundaryState = {
  error: Error | null
}

async function updateServiceWorker(): Promise<ServiceWorkerRegistration> {
  const ready = await navigator.serviceWorker.ready
  // the return type of update is incorrectly typed as Promise<void>. See
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update
  return ready.update() as unknown as Promise<ServiceWorkerRegistration>
}

class ErrorBoundary extends React.Component<WithTranslation, ErrorBoundaryState> {
  constructor(props: WithTranslation) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    updateServiceWorker()
      .then(async registration => {
        // We want to refresh only if we detect a new service worker is waiting to be activated.
        // See details about it: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
        if (registration?.waiting) {
          await registration.unregister()

          // Makes Workbox call skipWaiting(). For more info on skipWaiting see: https://developer.chrome.com/docs/workbox/handling-service-worker-updates/
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })

          // Once the service worker is unregistered, we can reload the page to let
          // the browser download a fresh copy of our app (invalidating the cache)
          window.location.reload()
        }
      })
      .catch(error => {
        console.error('Failed to update service worker', error)
      })
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // TODO: send to analytics
    console.error(error, errorInfo)
  }

  render() {
    const { error } = this.state

    if (error !== null) {
      return (
        <PageWrapper>
          <ContentWrapper>
            <Card>
              <Container gap={'md'} justify="center">
                <Number>500</Number>
                <Title>{this.props.t('internalServerError')}</Title>
                <Text>{this.props.t('somethingWentWrong')}</Text>
                <a href={window.location.origin}>
                  <ButtonDark>{this.props.t('backToHome')}</ButtonDark>
                </a>
              </Container>
            </Card>
          </ContentWrapper>
        </PageWrapper>
      )
    }
    return this.props.children
  }
}

export default withTranslation()(ErrorBoundary)
