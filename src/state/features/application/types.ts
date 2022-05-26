import { NetworkInfo } from 'constants/networks'

export type HealthStatus = {
  syncedBlock: number
  headBlock: number
}

export interface ApplicationState {
  timeKey: string
  latestBlock: number
  headBlock: number
  activeNetwork: NetworkInfo
}
