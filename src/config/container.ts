import { Container as InversifyContainer } from 'inversify';

import '../controllers';
import { AcronymRepository } from '../repositories';
import { IAcronymRepository } from '../repositories/interfaces';
import { AcronymService } from '../services';
import { IAcronymService } from '../services/interfaces';

class Container {
  private _instance: InversifyContainer;

  public constructor() {
    this._instance = new InversifyContainer();
    this.bindDependencies();
  }

  public get instance(): InversifyContainer {
    return this._instance;
  }

  private bindDependencies() {
    // Repositories
    this._instance
      .bind<IAcronymRepository>('IAcronymRepository')
      .to(AcronymRepository);

    // Services
    this.instance.bind<IAcronymService>('IAcronymService').to(AcronymService);
  }
}

export default new Container();
