import { Acronym, GetAcronymOptions, GetAcronymsResponse } from '../../types';

interface IAcronymRepository {
  createAcronym(acronym: Acronym): Promise<Acronym>;
  deleteAcronym(acronym: string): Promise<void>;
  getAcronyms(options: GetAcronymOptions): Promise<GetAcronymsResponse>;
  updateAcronym(acronym: Acronym): Promise<void>;
}

export default IAcronymRepository;
