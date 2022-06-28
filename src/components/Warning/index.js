import { AlertTriangle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import { Text } from 'rebass'
import styled from 'styled-components/macro'
import { ButtonDark } from 'components/ButtonStyled'
import { AutoColumn } from 'components/Column'
import Link from 'components/Link'
import { RowBetween, RowFixed } from 'components/Row'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { getBlockChainScanLink, getViewOnScanKey } from 'utils'
import { Hover } from '..'

const WarningWrapper = styled.div`
  border-radius: 20px;
  border: 1px solid #f82d3a;
  background: rgba(248, 45, 58, 0.05);
  padding: 1rem;
  color: #f82d3a;
  display: ${({ show }) => !show && 'none'};
  margin: 0 2rem 2rem 2rem;
  position: relative;

  @media screen and (max-width: 800px) {
    width: 80% !important;
    margin-left: 5%;
  }
`

const StyledWarningIcon = styled(AlertTriangle)`
  min-height: 20px;
  min-width: 20px;
  stroke: red;
`

export default function Warning({ show, setShow, address }) {
  const { t } = useTranslation()
  const activeNetworkId = useActiveNetworkId()

  const below800 = useMedia('(max-width: 800px)')

  const textContent = below800 ? (
    <div>
      <Text fontWeight={500} lineHeight={'145.23%'} mt={'10px'}>
        {t('anyoneCanCreateWarning')}
      </Text>
      <Text fontWeight={500} lineHeight={'145.23%'} mt={'10px'}>
        {t('siteTracksAnalytics')}
      </Text>
    </div>
  ) : (
    <Text fontWeight={500} lineHeight={'145.23%'} mt={'10px'}>
      {`${t('anyoneCanCreateWarning')} ${t('siteTracksAnalytics')}`}
    </Text>
  )

  return (
    <WarningWrapper show={show}>
      <AutoColumn gap="4px">
        <RowFixed>
          <StyledWarningIcon />
          <Text fontWeight={600} lineHeight={'145.23%'} ml={'10px'}>
            {t('tokenSafetyAlert')}
          </Text>
        </RowFixed>
        {textContent}
        {below800 ? (
          <div>
            <Hover style={{ marginTop: '10px' }}>
              <Link
                fontWeight={500}
                lineHeight={'145.23%'}
                color={'#2172E5'}
                href={getBlockChainScanLink(activeNetworkId, address, 'address')}
                target="_blank"
              >
                {t(getViewOnScanKey(activeNetworkId))}
              </Link>
            </Hover>
            <RowBetween style={{ marginTop: '20px' }}>
              <div />
              <ButtonDark color={'#f82d3a'} style={{ minWidth: '140px' }} onClick={() => setShow(false)}>
                {t('iUnderstand')}
              </ButtonDark>
            </RowBetween>
          </div>
        ) : (
          <RowBetween style={{ marginTop: '10px' }}>
            <Hover>
              <Link
                fontWeight={500}
                lineHeight={'145.23%'}
                color={'#2172E5'}
                href={getBlockChainScanLink(activeNetworkId, address, 'address')}
                target="_blank"
              >
                {t(getViewOnScanKey(activeNetworkId))}
              </Link>
            </Hover>
            <ButtonDark color={'#f82d3a'} style={{ minWidth: '140px' }} onClick={() => setShow(false)}>
              {t('iUnderstand')}
            </ButtonDark>
          </RowBetween>
        )}
      </AutoColumn>
    </WarningWrapper>
  )
}
