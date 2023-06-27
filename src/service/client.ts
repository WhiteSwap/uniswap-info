import { ApolloClient, DefaultOptions, HttpLink, InMemoryCache } from 'apollo-boost'
import { SupportedNetwork } from 'constants/networks'
import { getCurrentNetwork } from 'utils'
import config from './config'

const defaultOptions: DefaultOptions = {
  query: {
    fetchPolicy: 'cache-first'
  }
}

function initApolloClient(network: SupportedNetwork) {
  const clientLink = new HttpLink({
    uri: config[network]
  })

  return new ApolloClient({
    link: clientLink,
    cache: new InMemoryCache(),
    defaultOptions
  })
}

let client = initApolloClient(getCurrentNetwork().id)

function changeApiClient(network: SupportedNetwork) {
  client = initApolloClient(network)
}

export { client, changeApiClient }
