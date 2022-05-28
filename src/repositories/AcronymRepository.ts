import { injectable } from 'inversify';

import { HttpError } from '../helpers/errors/HttpError';
import { createFuzzyMatchRegex } from '../helpers/regex';
import { Acronym as AcronymType, GetAcronymOptions, GetAcronymsResponse } from '../types';
import logger from '../lib/logger';
import Acronym from '../models/Acronym';
import IAcronymRepository from './interfaces/IAcronymRepository';
import { MONGO_DUPLICATE_KEY_ERROR_CODE } from '../constants';

@injectable()
export default class AcronymRepository implements IAcronymRepository {
  async getAcronyms(options: GetAcronymOptions): Promise<GetAcronymsResponse> {
    const fuzzyMatchRegex = createFuzzyMatchRegex(options.search);

    const acronymsAggregationResponse = await Acronym.aggregate([
      {
        $match: {
          $or: [
            { definition: { $regex: fuzzyMatchRegex } },
            { name: { $regex: fuzzyMatchRegex } },
          ],
        },
      },
      {
        $facet: {
          stage1: [{ $group: { _id: null, count: { $sum: 1 } } }],

          stage2: [{ $skip: options.skip }, { $limit: options.limit }],
        },
      },

      { $unwind: '$stage1' },

      // output projection
      {
        $project: {
          totalCount: '$stage1.count',
          acronyms: '$stage2',
        },
      },
    ]);

    const accronymResponse = acronymsAggregationResponse[0] || {
      totalCount: 0,
      acronyms: [],
    };

    logger.info(`GetAcroynms: Foud ${accronymResponse.totalCount} acronyms.`);

    return {
      totalCount: accronymResponse.totalCount,
      acronyms: accronymResponse.acronyms.map(({ name, definition }) => ({ name, definition })),
    };
  }

  async createAcronym(acronym: AcronymType): Promise<void> {
    try {
      const createdAcronym = await Acronym.create(acronym);

      logger.info(`Acronym ${createdAcronym.name}: ${createdAcronym.definition} successfully created.`);
    } catch (err) {
      if (err.code === MONGO_DUPLICATE_KEY_ERROR_CODE) {
        throw new HttpError({
          status: 409,
          message: `Acronym: ${acronym.name} - ${acronym.definition} already exists!`,
        });
      }
    }
  }

  async updateAcronym(acronym: AcronymType): Promise<void> {
    const updatedAcronym = await Acronym.findOneAndUpdate(
      { name: acronym.name },
      { $set: { definition: acronym.definition } }
    );

    if (!updatedAcronym) {
      throw new HttpError({ status: 404, message: 'Acronym not found.' });
    }

    logger.info(`Acronym ${updatedAcronym.name}: ${updatedAcronym.definition} successfully updated.`);
  }

  async deleteAcronym(acronym: string): Promise<void> {
    const deletedAcronym = await Acronym.findOneAndDelete({ name: acronym });

    if (!deletedAcronym) {
      throw new HttpError({ status: 404, message: 'Acronym not found.' });
    }

    logger.info(`Acronym ${deletedAcronym.name}: ${deletedAcronym.definition} successfully deleted.`);
  }
}
