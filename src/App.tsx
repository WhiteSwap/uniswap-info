import { useState } from 'react'
import * as Sentry from '@sentry/react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useMedia } from 'react-use'
import styled, { ThemeProvider } from 'styled-components/macro'
import FallbackError from 'components/FallbackError'
import LocalLoader from 'components/LocalLoader'
import Navigation from 'components/Navigation'
import PinnedData from 'components/PinnedData'
import AccountLookup from 'pages/AccountLookup'
import AccountPage from 'pages/AccountPage'
import AllPairsPage from 'pages/AllPairsPage'
import AllTokensPage from 'pages/AllTokensPage'
import GlobalPage from 'pages/GlobalPage'
import PairPage from 'pages/PairPage'
import TokenPage from 'pages/TokenPage'
import { useLatestBlocks } from 'state/features/application/hooks'
import { useFetchActiveTokenPrice, useGlobalChartData } from 'state/features/global/hooks'
import { useActiveTokenPrice } from 'state/features/global/selectors'
import { useFetchPairs } from 'state/features/pairs/hooks'
import { useFetchTokens } from 'state/features/token/hooks'
import { useAppSelector } from 'state/hooks'
import { GlobalStyle, globalTheme } from 'Theme'
import { useFormatPath, useScrollToTop } from './hooks'

const AppWrapper = styled.div`
  position: relative;
  width: 100%;
`
const ContentWrapper = styled.div<{ open: boolean }>`
  display: grid;
  grid-template-columns: ${({ open }) => (open ? '220px 1fr 200px' : '220px 1fr 64px')};

  @media screen and (max-width: 1400px) {
    grid-template-columns: 220px 1fr;
  }

  @media screen and (max-width: 1080px) {
    grid-template-columns: 1fr;
    max-width: 100vw;
    overflow: hidden;
    grid-gap: 0;
  }
`

const Right = styled.aside<{ open: boolean }>`
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 9999;
  width: ${({ open }) => (open ? '220px' : '64px')};
  height: ${({ open }) => (open ? 'fit-content' : '64px')};
  overflow: auto;
  background-color: ${({ theme }) => theme.bg1};
  @media screen and (max-width: 1400px) {
    display: none;
  }
`

const Main = styled.main<{ showedMobileWarning: boolean }>`
  height: 100%;
  transition: width 0.25s ease;
  background-color: ${({ theme }) => theme.onlyLight};

  @media screen and (max-width: 1080px) {
    padding-top: ${({ showedMobileWarning }) => (showedMobileWarning ? '8rem' : '4.5rem')};
  }

  @media screen and (max-width: 438px) {
    padding-top: ${({ showedMobileWarning }) => (showedMobileWarning ? '9rem' : '4.5rem')};
  }
`

const WarningWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const HeaderContainerWithWarning = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 9999;

  header {
    position: unset;
  }
`

const WarningBanner = styled.div`
  background-color: #ff6871;
  padding: 1.5rem;
  color: white;
  width: 100%;
  text-align: center;
  font-weight: 500;
`

const BLOCK_DIFFERENCE_THRESHOLD = 30

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

function App() {
  const [savedOpen, setSavedOpen] = useState(false)
  const isDarkMode = useAppSelector(state => state.user.darkMode)
  const below1080 = useMedia('(max-width: 1080px)')

  const globalChartData = useGlobalChartData()
  const [latestBlock, headBlock] = useLatestBlocks()
  const price = useActiveTokenPrice()
  const formatPath = useFormatPath()
  const showWarning = headBlock - latestBlock > BLOCK_DIFFERENCE_THRESHOLD
  const showDesktopWarning = showWarning && !below1080
  const showMobileWarning = showWarning && below1080

  useScrollToTop()
  useFetchActiveTokenPrice()
  useFetchPairs()
  useFetchTokens()

  return (
    <ThemeProvider theme={globalTheme(isDarkMode)}>
      <GlobalStyle />
      <AppWrapper>
        {showDesktopWarning ? (
          <WarningWrapper>
            <WarningBanner>
              {`Warning: The data on this site has only synced to Ethereum block ${latestBlock} (out of ${headBlock}). Please check back soon.`}
            </WarningBanner>
          </WarningWrapper>
        ) : undefined}
        <Sentry.ErrorBoundary fallback={FallbackError}>
          {latestBlock && headBlock && price && Object.keys(globalChartData).length > 0 ? (
            <ContentWrapper open={savedOpen}>
              {showMobileWarning ? (
                <HeaderContainerWithWarning>
                  <WarningWrapper>
                    <WarningBanner>
                      {`Warning: The data on this site has only synced to Ethereum block ${latestBlock} (out of ${headBlock}). Please check back soon.`}
                    </WarningBanner>
                  </WarningWrapper>
                  <Navigation />
                </HeaderContainerWithWarning>
              ) : (
                <Navigation />
              )}
              <Main id="center" showedMobileWarning={showMobileWarning}>
                <SentryRoutes>
                  <Route path="/:networkID" element={<GlobalPage />} />
                  <Route path="/:networkID/tokens" element={<AllTokensPage />} />
                  <Route path="/:networkID/tokens/:tokenAddress" element={<TokenPage />} />
                  <Route path="/:networkID/pairs" element={<AllPairsPage />} />
                  <Route path="/:networkID/pairs/:pairAddress" element={<PairPage />} />
                  <Route path="/:networkID/accounts" element={<AccountLookup />} />
                  <Route path="/:networkID/accounts/:accountAddress" element={<AccountPage />} />
                  <Route path="*" element={<Navigate to={formatPath('/')} replace />} />
                </SentryRoutes>
              </Main>
              <Right open={savedOpen}>
                <PinnedData open={savedOpen} setSavedOpen={setSavedOpen} />
              </Right>
            </ContentWrapper>
          ) : (
            <LocalLoader fullscreen />
          )}
        </Sentry.ErrorBoundary>
      </AppWrapper>
    </ThemeProvider>
  )
}

export default Sentry.withProfiler(App)
