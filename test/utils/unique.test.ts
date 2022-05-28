import { unique } from '../../src/utils/unique';
import { Acronym } from '../../src/types';

describe('Unique array of objects', () => {
  it('shoud unique elements of the array', () => {
    const acronyms: Acronym[] = [
      {
        name: 'acr',
        definition: 'acronym',
      },
      {
        name: 'acr1',
        definition: 'acronym1',
      },
      {
        name: 'acr', // NOTE: should not be included in uniqe acronyms
        definition: 'acronym',
      },
    ];

    const uniqueAcronyms = unique(acronyms);

    expect(uniqueAcronyms).toStrictEqual([
      {
        name: 'acr',
        definition: 'acronym',
      },
      {
        name: 'acr1',
        definition: 'acronym1',
      },
    ]);
  });
});
