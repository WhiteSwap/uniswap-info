import { useState, useCallback, useEffect, useRef, RefObject } from 'react'
import { shade } from 'polished'
import Vibrant from 'node-vibrant'
import { hex } from 'wcag-contrast'
import { getTokenLogoUrl, networkPrefix } from 'utils'
import copy from 'copy-to-clipboard'
import { useAppSelector } from 'state/hooks'
import { useActiveNetworkId } from 'state/features/application/selectors'
import { useLocation } from 'react-router-dom'

export function useColor(tokenAddress: string, token?: string) {
  const [color, setColor] = useState('#2172E5')
  const activeNetwork = useActiveNetworkId()
  if (tokenAddress) {
    const path = getTokenLogoUrl(activeNetwork, tokenAddress)
    if (path) {
      Vibrant.from(path).getPalette((_error, palette) => {
        if (palette && palette.Vibrant) {
          let detectedHex = palette.Vibrant.hex
          let AAscore = hex(detectedHex, '#FFF')
          while (AAscore < 3) {
            detectedHex = shade(0.005, detectedHex)
            AAscore = hex(detectedHex, '#FFF')
          }
          if (token && token === 'DAI') {
            setColor('#FAAB14')
          } else {
            setColor(detectedHex)
          }
        }
      })
    }
  }
  return color
}

export function useCopyClipboard(timeout = 500) {
  const [isCopied, setIsCopied] = useState(false)

  const staticCopy = useCallback(text => {
    const didCopy = copy(text)
    setIsCopied(didCopy)
  }, [])

  useEffect(() => {
    if (isCopied) {
      const hide = setTimeout(() => {
        setIsCopied(false)
      }, timeout)

      return () => {
        clearTimeout(hide)
      }
    }
    return undefined
  }, [isCopied, setIsCopied, timeout])

  return [isCopied, staticCopy]
}

export const useOutsideClick = (ref: RefObject<any>, ref2: RefObject<any>, callback: (value: boolean) => void) => {
  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref2.current) {
      callback(true)
    } else if (
      ref.current &&
      !ref.current.contains(event.target) &&
      ref2.current &&
      !ref2.current.contains(event.target)
    ) {
      callback(true)
    } else {
      callback(false)
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
}

export default function useInterval(callback: () => void, delay: null | number) {
  const savedCallback = useRef<() => void>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      const current = savedCallback.current
      current && current()
    }

    if (delay !== null) {
      tick()
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
    return undefined
  }, [delay])
}

export function useFormatPath() {
  const activeNetwork = useAppSelector(state => state.application.activeNetwork)

  return useCallback(
    (url?: string) => {
      const path = networkPrefix(activeNetwork)
      return url ? `${path}${url}` : path
    },
    [activeNetwork]
  )
}

export function useScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])
}
