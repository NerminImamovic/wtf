import mongoose from 'mongoose';

import { NODE_ENV, MONGO_URL, TEST_ENV } from '../constants';
import { unique } from '../utils/unique';
import logger from '../lib/logger';
import Acronym from '../models/Acronym';
import { Database } from './database';

const rawAcronyms = require('./seed/acronyms.json');

export class MongoDB extends Database {
  public constructor() {
    super();
    if (NODE_ENV !== TEST_ENV) {
      this.connectDatabase();
      this.seedDatabase();
    }
  }

  public async connectDatabase() {
    await mongoose.connect(MONGO_URL);
  }

  public async seedDatabase() {
    const existingAcronyms = (await Acronym.find({})).length > 0;
    if (existingAcronyms) return;

    logger.info('Data seeding started.');

    const acronymsToAdd = unique(rawAcronyms).map(rawAcronym => {
      const [[name, definition]] = Object.entries(rawAcronym);

      return {
        name,
        definition,
      };
    });

    await Acronym.insertMany(acronymsToAdd, { ordered: false });

    logger.info('Data succsssfully seeded!');
  }
}
