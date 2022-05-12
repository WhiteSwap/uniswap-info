import { ITokenDataController } from 'data/controllers/types/TokenController.interface'
import { client } from 'service/client'
import { TOKEN_SEARCH } from 'service/queries/ethereum/tokens'
import { IntervalTokenDataMock, TokenChartDatMock, TokenPairsMock } from '__mocks__/tokens'
import { tokenMapper, topTokensMapper, tokenChartDataMapper } from 'data/mappers/tron/tokenMappers'
import { TOKENS, TOKEN_BY_ADDRESS } from 'service/queries/tron/tokens'
import { TokenByAddressQuery, TokenByAddressQueryVariables, TokensQuery } from 'service/generated/tronGraphql'

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
    const { data } = await client.query<TokenByAddressQuery, TokenByAddressQueryVariables>({
      query: TOKEN_BY_ADDRESS,
      // FIXME: remove when backend fix types on graphql
      variables: { address: address as unknown as number }
    })
    return tokenMapper(data.token)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getTokenPairs(_tokenAddress: string) {
    return Promise.resolve(TokenPairsMock)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getIntervalTokenData(_tokenAddress: string, _startTime: number, _interval: number, _latestBlock: number) {
    return Promise.resolve(IntervalTokenDataMock)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getTokenChartData(_tokenAddress: string) {
    return tokenChartDataMapper(await Promise.resolve(TokenChartDatMock))
  }
}
