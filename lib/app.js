/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

// heartbeat route
app.get('/', (req, res) => {
  res.send('Strongest API');
});

// API routes,
app.post('/api/strongest', async (req, res) => {
  try {
    const being = req.body;

    const data = await client.query(`
    INSERT INTO strongest (name, type, description, power, is_good)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, type, description, power, is_good as "isGood";
    `, [being.name, being.type, being.description, being.power, being.isGood])
    
    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/strongest/:id', async(req, res) => {
  try {
    const being = req.body;

    const data = await client.query(`
      UPDATE strongest
        SET name = $1, 
            type = $2, 
            description = $3,
            power = $4,
            is_good = $5
      WHERE id = $6
      RETURNING id, name, type, description, power, is_good as "isGood";
    `, [being.name, being.type, being.description, being.power, being.isGood, req.params.id]);
  
    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/strongest', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT id,
             name,
             type,
             description,
             power,
             is_good as "isGood"
      FROM   strongest;
    `);
    
    res.json(data.rows);
  } 
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/strongest/:id', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT id,
             name,
             type,
             description,
             power,
             is_good as "isGood"
      FROM   strongest
      WHERE id = $1;
    `, [req.params.id]);
  
    res.json(data.rows[0] || null);
  } 
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/strongest/:id', async (req, res) => {
  try { 
    const data = await client.query(`
      DELETE FROM strongest
      WHERE id = $1
      RETURNING id, name, type, description, power, is_good as "isGood";
    `,
    [req.params.id]);

    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;

