import ReactDOM from 'react-dom'
import { StrictMode, Suspense } from 'react'
import { BrowserRouter, createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom'
import ReactGA from 'react-ga'
import { isMobile } from 'react-device-detect'
import { ApolloClient, ApolloProvider } from '@apollo/react-hooks'
import ThemeProvider, { GlobalStyle } from 'Theme'
import { PersistGate } from 'redux-persist/integration/react'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import utc from 'dayjs/plugin/utc'
import { store, persistor } from 'state/store'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import App from 'App'
import 'i18n'
import { client } from 'service/client'
import React from 'react'

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: process.env.REACT_APP_VERSION,
  environment: process.env.REACT_APP_ENV,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
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
    customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
  })
  ReactGA.pageview(window.location.pathname)
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
}

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <ApolloProvider client={client as unknown as ApolloClient<any>}>
            <GlobalStyle />
            <BrowserRouter>
              <Suspense fallback={null}>
                <App />
              </Suspense>
            </BrowserRouter>
          </ApolloProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)
