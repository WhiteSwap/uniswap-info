import { useCallback, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-use'
import { SUPPORTED_NETWORK_VERSIONS, NetworkInfo } from 'constants/networks'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { changeApiClient } from 'service/client'
import { setActiveNetwork } from 'state/features/application/slice'
import { useAppSelector } from 'state/hooks'
import {
  NetworkSwitcherContainer,
  CurrentNetwork,
  NetworkList,
  NetworkListItem,
  NetworkLogo,
  NetworkName,
  NetworkBlurb,
  NetworkListItemLink
} from './styled'

const NetworkSwitcher = () => {
  const activeNetwork = useAppSelector(state => state.application.activeNetwork)
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const { pathname } = useLocation()

  const handleSelect = useCallback(
    (network: NetworkInfo) => {
      if (activeNetwork.id !== network.id) {
        dispatch(setActiveNetwork(network))
        changeApiClient(network.id)
      }
      setIsOpen(false)
    },
    [activeNetwork.route, pathname]
  )

  const node = useRef(null)
  useOnClickOutside(node, isOpen ? () => setIsOpen(false) : undefined)

  return (
    <NetworkSwitcherContainer>
      <CurrentNetwork onClick={() => setIsOpen(!isOpen)}>
        <NetworkLogo src={activeNetwork.imageURL} alt={activeNetwork.name} />
        <NetworkName>{activeNetwork.name}</NetworkName>
        {activeNetwork.blurb ? <NetworkBlurb>{activeNetwork.blurb}</NetworkBlurb> : undefined}
      </CurrentNetwork>
      {isOpen ? (
        <NetworkList ref={node}>
          {SUPPORTED_NETWORK_VERSIONS.map(network => (
            <NetworkListItem key={network.id} onClick={() => handleSelect(network)}>
              <NetworkListItemLink to={`${network.route}/`}>
                <NetworkLogo src={network.imageURL} alt={network.name} />
                <span>{network.name}</span>
                {network.blurb ? <NetworkBlurb>{network.blurb}</NetworkBlurb> : undefined}
              </NetworkListItemLink>
            </NetworkListItem>
          ))}
        </NetworkList>
      ) : null}
    </NetworkSwitcherContainer>
  )
}

export default NetworkSwitcher
