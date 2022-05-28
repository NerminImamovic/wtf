import { inject, injectable } from 'inversify';

import { Acronym, GetAcronymOptions, GetAcronymsResponse } from '../types';
import IAcronymRepository from '../repositories/interfaces/IAcronymRepository';
import IAcronymService from './interfaces/IAcronymService';
import { HttpError } from '../helpers/errors/HttpError';

@injectable()
export default class AcronymService implements IAcronymService {
  constructor(
    @inject('IAcronymRepository') private acronymRepository: IAcronymRepository
  ) {}

  public getAcronyms(options: GetAcronymOptions): Promise<GetAcronymsResponse> {
    return this.acronymRepository.getAcronyms(options);
  }

  public async createAcronym(acronym: Acronym): Promise<void> {
    return this.acronymRepository.createAcronym(acronym);
  }

  public async updateAcronym(
    acronymName: string,
    acronym: Acronym
  ): Promise<void> {
    if (acronymName !== acronym.name) {
      throw new HttpError({ status: 403, message: 'Could not update wrong acronym' });
    }

    return this.acronymRepository.updateAcronym(acronym);
  }

  public async deleteAcronym(acronym: string): Promise<void> {
    await this.acronymRepository.deleteAcronym(acronym);
  }
}
