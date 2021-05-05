import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/strongest', () => {

    beforeAll(() => {
      execSync('npm run recreate-tables');
    });

    //const expectedBeings = [];

    let kirby = {
      id: expect.any(Number),
      name: 'Kirby',
      type: 'Bubblegum',
      description: 'Consumer of all, Destroyer of all, Friend to all.',
      power: 1000000000,
      isGood: true
    };

    let daffy = {
      id: expect.any(Number),
      name: 'Daffy Duck',
      type: 'Duck',
      description: 'Cartoon Duck',
      power: 1,
      isGood: true
    };

    let tomie = {
      id: expect.any(Number),
      name: 'Tomie',
      type: 'Demon',
      description: 'Bewitching to the point of insanity.',
      power: 10000,
      isGood: false
    };
  

    // If a GET request is made to /api/cats, does:
    // 1) the server respond with status of 200
    // 2) the body match the expected API data?
    test('POST kirby to /api/strongest', async () => {
      const response = await request
        .post('/api/strongest')
        .send(kirby);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(kirby);

      kirby = response.body;
    });
    
    test('PUT updated kirby to /api/strongest/:id', async () => {
    
      kirby.isGood = false;
      const response = await request 
        .put(`/api/strongest/${kirby.id}`)
        .send(kirby);
    
      expect(response.status).toBe(200);
      expect(response.body).toEqual(kirby);
   
    });
    
    test('GET list of beings from /api/strongest', async () => {
      const r1 = await request.post('/api/strongest').send(daffy);
      daffy = r1.body;
      const r2 = await request.post('/api/strongest').send(tomie);
      tomie = r2.body;

      const response = await request.get('/api/strongest');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([kirby, daffy, tomie]));
    });

    test('GET kirby from /api/strongest/:id', async () => {
      const response = await request.get(`/api/strongest/${kirby.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(kirby);
    });

    test('DELETE kirby from /api/strongest/:id', async () => {
      const response = await request.delete(`/api/strongest/${kirby.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(kirby);

      const getResponse = await request.get('/api/strongest');
      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toEqual(expect.arrayContaining([daffy, tomie]));
    });
  
  
  
    test.skip('GET /api/strongest', async () => {
    // act - make the request
      const response = await request.get('/api/strongest');

      // was response OK (200)?
      expect(response.status).toBe(200);

      // did it return the data we expected?
      // eslint-disable-next-line no-undef
      expect(response.body).toEqual(expectedBeings);

    });

    // If a GET request is made to /api/cats/:id, does:
    // 1) the server respond with status of 200
    // 2) the body match the expected API data for the cat with that id?
    test.skip('GET /api/strongest/:id', async () => {
      const response = await request.get('/api/strongest/2');
      expect(response.status).toBe(200);
      // eslint-disable-next-line no-undef
      expect(response.body).toEqual(expectedBeings[1]);
    });
  });
});
