import AccountDataController from 'data/controllers/AccountDataController'
import GlobalDataController from 'data/controllers/GlobalDataController'
import PairDataController from 'data/controllers/PairDataController'
import TokenDataController from 'data/controllers/TokenDataController'
import TransactionDataController from 'data/controllers/TransactionDataController'

import { IAccountDataController } from 'data/controllers/types/AccountController.interface'
import { IGlobalDataController } from 'data/controllers/types/GlobalController.interface'
import { IPairDataController } from 'data/controllers/types/PairController.interface'
import { ITokenDataController } from 'data/controllers/types/TokenController.interface'
import { ITransactionDataController } from 'data/controllers/types/TransactionController.interface'

class DataService {
  public tokens!: ITokenDataController
  public pairs!: IPairDataController
  public transactions!: ITransactionDataController
  public accounts!: IAccountDataController
  public global!: IGlobalDataController

  constructor() {
    this.initDataControllers()
  }

  public initDataControllers() {
    this.tokens = new TokenDataController()
    this.accounts = new AccountDataController()
    this.transactions = new TransactionDataController()
    this.global = new GlobalDataController()
    this.pairs = new PairDataController()
  }
}

export default new DataService()
