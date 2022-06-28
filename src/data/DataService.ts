import { SupportedNetwork } from 'constants/networks'
import EthAccountDataController from 'data/controllers/ethereum/AccountDataController'
import EthGlobalDataController from 'data/controllers/ethereum/GlobalDataController'
import EthPairDataController from 'data/controllers/ethereum/PairDataController'
import EthTokenDataController from 'data/controllers/ethereum/TokenDataController'
import EthTransactionDataController from 'data/controllers/ethereum/TransactionDataController'

import TrxAccountDataController from 'data/controllers/tron/AccountDataController'
import TrxGlobalDataController from 'data/controllers/tron/GlobalDataController'
import TrxPairDataController from 'data/controllers/tron/PairDataController'
import TrxTokenDataController from 'data/controllers/tron/TokenDataController'
import TrxTransactionDataController from 'data/controllers/tron/TransactionDataController'

import { IAccountDataController } from 'data/controllers/types/AccountController.interface'
import { IGlobalDataController } from 'data/controllers/types/GlobalController.interface'
import { IPairDataController } from 'data/controllers/types/PairController.interface'
import { ITokenDataController } from 'data/controllers/types/TokenController.interface'
import { ITransactionDataController } from 'data/controllers/types/TransactionController.interface'
import { getCurrentNetwork } from 'utils'

class DataService {
  public tokens!: ITokenDataController
  public pairs!: IPairDataController
  public transactions!: ITransactionDataController
  public accounts!: IAccountDataController
  public global!: IGlobalDataController

  constructor() {
    this.initDataControllers(getCurrentNetwork().id)
  }

  public initDataControllers(activeNetwork: SupportedNetwork) {
    switch (activeNetwork) {
      case SupportedNetwork.ETHEREUM: {
        this.tokens = new EthTokenDataController()
        this.accounts = new EthAccountDataController()
        this.transactions = new EthTransactionDataController()
        this.global = new EthGlobalDataController()
        this.pairs = new EthPairDataController()
        break
      }
      case SupportedNetwork.TRON:
      default: {
        this.tokens = new TrxTokenDataController()
        this.accounts = new TrxAccountDataController()
        this.transactions = new TrxTransactionDataController()
        this.global = new TrxGlobalDataController()
        this.pairs = new TrxPairDataController()
        break
      }
    }
  }
}

export default new DataService()
