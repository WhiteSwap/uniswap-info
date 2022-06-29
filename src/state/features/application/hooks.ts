import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { timeframeOptions } from 'constants/index'
import DataService from 'data/DataService'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { useActiveNetworkId, useTimeFrame } from './selectors'
import { setHeadBlock, setLatestBlock } from './slice'

export function useLatestBlocks() {
  const dispatch = useAppDispatch()
  const activeNetwork = useActiveNetworkId()
  const latestBlock = useAppSelector(state => state.application.latestBlock)
  const headBlock = useAppSelector(state => state.application.headBlock)

  useEffect(() => {
    async function fetch() {
      const result = await DataService.global.getHealthStatus()
      if (result) {
        dispatch(setLatestBlock(result.syncedBlock))
        dispatch(setHeadBlock(result.headBlock))
      }
    }
    fetch()
  }, [activeNetwork])

  return [latestBlock, headBlock]
}

export function useStartTimestamp() {
  const activeWindow = useTimeFrame()
  const [startDateTimestamp, setStartDateTimestamp] = useState<number | undefined>()

  // monitor the old date fetched
  useEffect(() => {
    const startTime =
      dayjs
        .utc()
        .subtract(1, activeWindow === timeframeOptions.WEEK ? 'week' : 'year')
        .startOf('day')
        .unix() - 1
    // if we find a new start time less than the current startrtime - update oldest pooint to fetch
    setStartDateTimestamp(startTime)
  }, [activeWindow, startDateTimestamp])

  return startDateTimestamp
}
