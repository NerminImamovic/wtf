import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application as ExpressApplication } from 'express';

import { Database } from './config/database';
import { MongoDB } from './config/MongoDB';

class Application {
  private readonly _instance: ExpressApplication;

  private _database: Database;

  public constructor() {
    this._instance = express();
    this._database = new MongoDB();
    this._instance.use(cors());
    this._instance.use(express.json());
    this._instance.use(bodyParser.json());
    this._instance.use(bodyParser.urlencoded({ extended: true }));
  }

  public get instance(): ExpressApplication {
    return this._instance;
  }
}

export default new Application();
