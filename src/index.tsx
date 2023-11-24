import { StrictMode, Suspense, useEffect } from 'react'
import { Buffer } from 'buffer'
import { ApolloClient, ApolloProvider } from '@apollo/react-hooks'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { Provider } from 'react-redux'
import { BrowserRouter, createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import App from 'App'
import { client } from 'service/client'
import { store, persistor } from 'state/store'
import 'i18n'

window.Buffer = window.Buffer || Buffer

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: process.env.REACT_APP_VERSION,
  environment: process.env.REACT_APP_ENV,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      )
    })
  ],
  tracesSampleRate: process.env.REACT_APP_ENV === 'production' ? 0.2 : 1
})
// initialize custom dayjs plugin
dayjs.extend(utc)
dayjs.extend(weekOfYear)

// initialize GA
const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string' && GOOGLE_ANALYTICS_ID !== '') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID)
  ReactGA.set({
    customBrowserType: isMobile
      ? 'web3' in window || 'ethereum' in window
        ? 'mobileWeb3'
        : 'mobileRegular'
      : 'desktop'
  })
  ReactGA.pageview(window.location.pathname)
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
}

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client as unknown as ApolloClient<any>}>
          <BrowserRouter>
            <Suspense fallback={null}>
              <App />
            </Suspense>
          </BrowserRouter>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)
