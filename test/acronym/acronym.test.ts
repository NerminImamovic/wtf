/**
* @jest-environment node
*/
import 'reflect-metadata';
import mongoose from 'mongoose';
import supertest from 'supertest';
import Acronym from '../../src/models/Acronym';
import { Acronym as AcronymType } from '../../src/types/index';

import { MONGO_URL } from '../../src/constants';
import serverInstance from '../../src/server';

describe('Application Endpoint tests', () => {
  const request = supertest(serverInstance);

  beforeAll(async done => {
    await mongoose.connect(MONGO_URL);
    done();
  });

  afterEach(async done => {
    await Acronym.deleteMany({});
    done();
  });

  describe('GET /acronym - Get acronyms', () => {
    it('sould get all acronyms (get first 10 acronyms)', async done => {
      // Insert 15 Acronyms
      await insertAcronyms(15);

      const response = await request.get('/acronym');
      const acronyms = extractAcronyms(response);

      expect(response.status).toBe(206);
      expect(acronyms.length).toBe(10);
      expect(response.header['content-range']).toBe('acronyms 1 - 10/15');

      done();
    });

    it('should pagiante acronyms ', async done => {
      // Insert 15 acronyms
      await insertAcronyms(15);

      const responsePage1 = await request.get('/acronym?limit=5');
      const acronymsPage1 = extractAcronyms(responsePage1);

      expect(responsePage1.status).toBe(206);
      expect(acronymsPage1.length).toBe(5);
      expect(responsePage1.header['content-range']).toBe('acronyms 1 - 5/15');

      const responsePage2 = await request.get('/acronym?from=6&limit=5');
      const acronymsPage2 = extractAcronyms(responsePage2);

      expect(responsePage2.status).toBe(206);
      expect(acronymsPage2.length).toBe(5);
      expect(responsePage2.header['content-range']).toBe('acronyms 6 - 10/15');

      const responsePage3 = await request.get('/acronym?from=11&limit=5');
      const acronymsPage3 = extractAcronyms(responsePage3);

      expect(responsePage3.status).toBe(206);
      expect(acronymsPage3.length).toBe(5);
      expect(responsePage3.header['content-range']).toBe('acronyms 11 - 15/15');

      done();
    });

    it('should search acronyms (fuzzy search)', async done => {
      // insert acronyms
      await Acronym.insertMany([
        {
          name: 'acr1', // <<< Note: shoudl not be included
          definition: 'acronym 1',
        },
        {
          name: 'acr21',
          definition: 'acronym 21',
        },
        {
          name: 'acr121',
          definition: 'acronym 121',
        },
      ]);

      const response = await request.get('/acronym?search=c2');
      const acronyms = extractAcronyms(response);

      expect(response.status).toBe(206);
      expect(acronyms).toStrictEqual([
        {
          name: 'acr21',
          definition: 'acronym 21',
        },
        {
          name: 'acr121',
          definition: 'acronym 121',
        },
      ]);
      expect(response.header['content-range']).toBe('acronyms 1 - 2/2');

      done();
    });

    it('should return empty list of acronyms', async done => {
      const response = await request.get('/acronym');
      const acronyms = extractAcronyms(response);

      expect(response.status).toBe(206);
      expect(acronyms).toStrictEqual([]);
      expect(response.header['content-range']).toBe('acronyms 0 - 0/0');

      done();
    });
  });

  describe('POST /acronym - Create Acronym', () => {
    it('should create Acronym', async done => {
      const acronym = { name: 'acr', definition: 'acronym' };
      const response = await request.post('/acronym').send(acronym);

      expect(response.status).toEqual(201);
      expect(extractAcronym(response)).toStrictEqual(acronym);

      const insertedAcroynms = await readAcronyms();
      expect(insertedAcroynms).toStrictEqual([acronym]);

      done();
    });

    it('should create acronym with same name', async done => {
      const acronym1 = { name: 'acr', definition: 'acronym1' };
      const response1 = await request.post('/acronym').send(acronym1);
      expect(response1.status).toEqual(201);
      expect(extractAcronym(response1)).toStrictEqual(acronym1);

      const acronym2 = { name: 'acr', definition: 'acronym2' };
      const response2 = await request.post('/acronym').send(acronym2);
      expect(response2.status).toEqual(201);
      expect(extractAcronym(response2)).toStrictEqual(acronym2);

      const insertedAcroynms = await readAcronyms();
      expect(insertedAcroynms).toStrictEqual([acronym1, acronym2]);

      done();
    });

    it('should create acronym with same definition', async done => {
      const acronym1 = { name: 'acr1', definition: 'acronym' };
      const response1 = await request.post('/acronym').send(acronym1);
      expect(response1.status).toEqual(201);
      expect(extractAcronym(response1)).toStrictEqual(acronym1);

      const acronym2 = { name: 'acr2', definition: 'acronym' };
      const response2 = await request.post('/acronym').send(acronym2);
      expect(response2.status).toEqual(201);
      expect(extractAcronym(response1)).toStrictEqual(acronym1);

      const insertedAcroynms = await readAcronyms();
      expect(insertedAcroynms).toStrictEqual([acronym1, acronym2]);

      done();
    });

    it('could not create acronym with same value and definition', async done => {
      const acronym: AcronymType = { name: 'acr-same', definition: 'acronym-same' };
      const response1 = await request.post('/acronym').send(acronym);
      expect(response1.status).toEqual(201);

      // await Acronym.create(acronym1);
      const response2 = await request.post('/acronym').send(acronym);
      const response2Body = JSON.parse(response2.text);

      expect(response2.status).toEqual(409);
      expect(response2Body.message).toEqual('Acronym: acr-same - acronym-same already exists!');

      done();
    });

    it('should throw bad request error for missing body', async done => {
      const response = await request.post('/acronym').send(undefined);
      expect(response.status).toEqual(400);

      done();
    })
  });

  describe('PUT /acronym/:acronym - Update Acronym', () => {
    it('should update Acronym', async done => {
      const acronym: AcronymType = { name: 'acr', definition: 'acronym' };
      await request.post('/acronym').send(acronym);

      const response = await request.put('/acronym/acr')
        .send({ ...acronym, definition: 'acronym updated' })
        .set('Auth', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o');

      expect(response.status).toEqual(204);

      const insertedAcroynms = await readAcronyms();
      expect(insertedAcroynms).toStrictEqual([
        {
          name: 'acr', definition: 'acronym updated',
        }]);

      done();
    });

    it('should fail to update acronym - Unauthorized - token not provided', async done => {
      const acronym: AcronymType = { name: 'acr', definition: 'acronym' };
      await request.post('/acronym').send(acronym);

      const response = await request.put('/acronym/acr')
        .send({ ...acronym, definition: 'acronym updated' });

      expect(response.status).toEqual(401);

      done();
    });

    it('should fail to update acronym - Unauthorized - Invalid token', async done => {
      const acronym: AcronymType = { name: 'acr', definition: 'acronym' };
      await request.post('/acronym').send(acronym);

      const response = await request.put('/acronym/acr')
        .send({ ...acronym, definition: 'acronym updated' })
        .set('Auth', 'Bearer token');

      expect(response.status).toEqual(401);

      done();
    });

    it('should fail to update acronym - Doesn not exist', async done => {
      const response = await request.put('/acronym/acr')
        .send({ name: 'acr', definition: 'acronym updated' })
        .set('Auth', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o');

      expect(response.status).toEqual(404);

      const insertedAcroynms = await readAcronyms();
      expect(insertedAcroynms).toStrictEqual([]);

      done();
    });

    it('should fail to update acronym - Invalid parameters', async done => {
      const response = await request.put('/acronym/acr')
        .send({ name: 'acr1', definition: 'acronym updated' })
        .set('Auth', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o');

      expect(response.status).toEqual(403);

      const insertedAcroynms = await readAcronyms();
      expect(insertedAcroynms).toStrictEqual([]);

      done();
    });
  });

  describe('DELETE /acronym/:acronym - Update Acronym', () => {
    it('should delete Acronym', async done => {
      const acronym: AcronymType = { name: 'acr', definition: 'acronym' };
      await request.post('/acronym').send(acronym);

      const response = await request.delete('/acronym/acr')
        .send({ ...acronym, definition: 'acronym updated' })
        .set('Auth', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o');

      expect(response.status).toEqual(204);

      const insertedAcroynms = await readAcronyms();
      expect(insertedAcroynms).toStrictEqual([]);

      done();
    });

    it('should fail to update acronym - Unauthorized', async done => {
      const acronym: AcronymType = { name: 'acr', definition: 'acronym' };
      await request.post('/acronym').send(acronym);

      const response = await request.delete('/acronym/acr')
        .send({ ...acronym, definition: 'acronym updated' });

      expect(response.status).toEqual(401);

      done();
    });

    it('should fail to delete acronym - Doesn not exist', async done => {
      const response = await request.delete('/acronym/acr')
        .set('Auth', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o');

      expect(response.status).toEqual(404);

      const insertedAcroynms = await readAcronyms();
      expect(insertedAcroynms).toStrictEqual([]);

      done();
    });
  });

  // Helpers
  async function insertAcronyms(acronymsNumber) {
    const array = new Array(acronymsNumber);
    const acronyms = array.fill(undefined).map((element, index) => ({ name: `ac${index}`, definition: `acronym ${index}` }));

    await Acronym.insertMany(acronyms);
  }

  async function readAcronyms() {
    const acronyms = await Acronym.find();

    return acronyms.map(({ name, definition }) => ({ name, definition }));
  }

  function extractAcronym(response): AcronymType {
    const responseData = response.text;
    const responseBody = JSON.parse(responseData) as AcronymType;
    return responseBody;
  }

  function extractAcronyms(response): AcronymType[] {
    const responseData = response.text;
    const responseBody = JSON.parse(responseData) as AcronymType[];
    return responseBody;
  }
});
