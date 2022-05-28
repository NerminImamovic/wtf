import { Acronym, GetAcronymOptions, GetAcronymsResponse } from '../../types';

interface IAcronymRepository {
  createAcronym(acronym: Acronym): Promise<void>;
  deleteAcronym(acronym: string): Promise<void>;
  getAcronyms(options: GetAcronymOptions): Promise<GetAcronymsResponse>;
  updateAcronym(acronym: Acronym): Promise<void>;
}

export default IAcronymRepository;
