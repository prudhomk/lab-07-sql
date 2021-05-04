import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  beforeAll(() => {
    execSync('npm run setup-db');
  });

  afterAll(async () => {
    return client.end();
  });

  const expectedBeings = [
    
    {
      id: expect.any(Number),
      name: 'Kirby',
      type: 'Bubblegum',
      description: 'Consumer of all, Destroyer of all, Friend to all.',
      power: 1000000000,
      isGood: true
      
    },
    {
      id: expect.any(Number),
      name: 'Kenshiro',
      type: 'Human',
      description: 'Successor to Hokuto Shinken, strongest man in the world.',
      power: 1000000,
      isGood: true
    },
    {
      id: expect.any(Number),
      name: 'Thanos',
      type: 'Titan',
      description: 'The mad titan, forever doomed to fail.',
      power: 999999,
      isGood: false
    },
    {
      id: expect.any(Number),
      name: 'Saitama',
      type: 'Human',
      description: 'A hero for fun, the strongest man in the universe.',
      power: 10000000,
      isGood: true
    },
    {
      id: expect.any(Number),
      name: 'Daffy Duck',
      type: 'Duck',
      description: 'Cartoon Duck',
      power: 1,
      isGood: true
    },
    {
      id: expect.any(Number),
      name: 'Tomie',
      type: 'Demon',
      description: 'Bewitching to the point of insanity.',
      power: 10000,
      isGood: false
    },
    {
      id: expect.any(Number),
      name: 'Arale',
      type: 'Robot',
      description: 'A robot girl who is unintentionally strong',
      power: 1000000,
      isGood: true
    },
    {
      id: expect.any(Number),
      name: 'Dr. Manhattan',
      type: 'Human',
      description: 'Man turned omniscient being (and blue).',
      power: 1000000000,
      isGood: true
    }
  ];

  // If a GET request is made to /api/cats, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data?
  it('GET /api/strongest', async () => {
    // act - make the request
    const response = await request.get('/api/strongest');

    // was response OK (200)?
    expect(response.status).toBe(200);

    // did it return the data we expected?
    expect(response.body).toEqual(expectedBeings);

  });

  // If a GET request is made to /api/cats/:id, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data for the cat with that id?
  test('GET /api/strongest/:id', async () => {
    const response = await request.get('/api/strongest/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedBeings[1]);
  });
});