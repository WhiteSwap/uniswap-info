import { ITokenDataController } from 'data/controllers/types/TokenController.interface'
import { client } from 'service/client'
import { TOKEN_SEARCH } from 'service/queries/ethereum/tokens'
import { IntervalTokenDataMock, TokenChartDatMock } from '__mocks__/tokens'
import { tokenMapper, topTokensMapper, tokenChartDataMapper } from 'data/mappers/tron/tokenMappers'
import {
  TokenQueryVariables,
  TokenQuery,
  TokensQuery,
  TokenPairsQuery,
  TokenPairsQueryVariables
} from 'service/generated/tronGraphql'
import { TOKENS, TOKEN, TOKEN_PAIRS } from 'service/queries/tron/tokens'

export default class TokenDataController implements ITokenDataController {
  async searchToken(value: string, id: string) {
    return client.query({
      query: TOKEN_SEARCH,
      variables: {
        value,
        id
      }
    })
  }
  async getTopTokens() {
    const { data } = await client.query<TokensQuery>({ query: TOKENS })
    return topTokensMapper(data)
  }
  async getTokenData(address: string) {
    const { data } = await client.query<TokenQuery, TokenQueryVariables>({
      query: TOKEN,
      variables: { address }
    })
    return tokenMapper(data.token)
  }
  async getTokenPairs(tokenAddress: string) {
    const { data } = await client.query<TokenPairsQuery, TokenPairsQueryVariables>({
      query: TOKEN_PAIRS,
      variables: { tokenAddress }
    })
    return data.tokenPairs
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getIntervalTokenData(_tokenAddress: string, _startTime: number, _interval: number, _latestBlock: number) {
    return IntervalTokenDataMock
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getTokenChartData(_tokenAddress: string) {
    return tokenChartDataMapper(await Promise.resolve(TokenChartDatMock))
  }
}
