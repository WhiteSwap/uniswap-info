import { useState } from 'react'
import styled from 'styled-components/macro'
import { Route, Routes, Navigate } from 'react-router-dom'
import GlobalPage from 'pages/GlobalPage'
import TokenPage from 'pages/TokenPage'
import PairPage from 'pages/PairPage'
import { useFetchActiveTokenPrice, useGlobalChartData } from 'state/features/global/hooks'
import { useFetchPairs } from 'state/features/pairs/hooks'
import { useFetchTokens } from 'state/features/token/hooks'
import AccountPage from 'pages/AccountPage'
import AllTokensPage from 'pages/AllTokensPage'
import AllPairsPage from 'pages/AllPairsPage'
import PinnedData from 'components/PinnedData'
import { useFormatPath, useScrollToTop } from './hooks'
import Navigation from 'components/Navigation'
import AccountLookup from 'pages/AccountLookup'
import LocalLoader from 'components/LocalLoader'
import { useLatestBlocks } from 'state/features/application/hooks'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { SupportedNetwork } from 'constants/networks'
import { useActiveTokenPrice } from 'state/features/global/selectors'

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

const Main = styled.main`
  height: 100%;
  transition: width 0.25s ease;
  background-color: ${({ theme }) => theme.onlyLight};

  @media screen and (max-width: 1080px) {
    padding-top: 4.5rem;
  }
`

const WarningWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
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

function App() {
  const [savedOpen, setSavedOpen] = useState(false)

  const globalChartData = useGlobalChartData()
  const [latestBlock, headBlock] = useLatestBlocks()
  const price = useActiveTokenPrice()
  const formatPath = useFormatPath()
  const activeNetwork = useActiveNetworkId()
  // show warning
  const showWarning = headBlock - latestBlock > BLOCK_DIFFERENCE_THRESHOLD
  useScrollToTop()

  useFetchActiveTokenPrice()
  useFetchPairs()
  useFetchTokens()

  return (
    <AppWrapper>
      {showWarning && (
        <WarningWrapper>
          <WarningBanner>
            {`Warning: The data on this site has only synced to Ethereum block ${latestBlock} (out of ${headBlock}). Please check back soon.`}
          </WarningBanner>
        </WarningWrapper>
      )}
      {latestBlock && headBlock && price && Object.keys(globalChartData).length > 0 ? (
        <ContentWrapper open={savedOpen}>
          <Navigation />
          <Main id="center">
            <Routes>
              <Route path="/:networkID" element={<GlobalPage />} />
              <Route path="/:networkID/tokens" element={<AllTokensPage />} />
              <Route path="/:networkID/tokens/:tokenAddress" element={<TokenPage />} />
              <Route path="/:networkID/pairs" element={<AllPairsPage />} />
              <Route path="/:networkID/pairs/:pairAddress" element={<PairPage />} />
              {activeNetwork === SupportedNetwork.ETHEREUM ? (
                <>
                  <Route path="/:networkID/accounts" element={<AccountLookup />} />
                  <Route path="/:networkID/accounts/:accountAddress" element={<AccountPage />} />
                </>
              ) : undefined}
              <Route path="*" element={<Navigate to={formatPath('/')} replace />} />
            </Routes>
          </Main>
          <Right open={savedOpen}>
            <PinnedData open={savedOpen} setSavedOpen={setSavedOpen} />
          </Right>
        </ContentWrapper>
      ) : (
        <LocalLoader fullscreen />
      )}
    </AppWrapper>
  )
}

export default App
