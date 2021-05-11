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
app.post('/api/auth/signup', async (req, res) => {
  try {
    const user = req.body;
    const data = await client.query(`
      INSERT INTO users (name, email, password)
      VALUES ( $1, $2, $3)
      RETURNING id, name, email;
      `, [user.name, user.email, user.password]);

    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});



app.post('/api/strongest', async (req, res) => {
  try {
    const being = req.body;

    const data = await client.query(`
    INSERT INTO strongest (name, type, image, description, power, is_good, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name, type, image, description, power, is_good as "isGood", user_id as "userId";
    `, [being.name, being.type, being.image, being.description, being.power, being.isGood, 1]);
    
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
            image = $3, 
            description = $4,
            power = $5,
            is_good = $6,
            user_id = $7
      WHERE id = $8
      RETURNING id, name, type, image, description, power, is_good as "isGood", user_id as "userId";
    `, [being.name, being.type, being.image, being.description, being.power, being.isGood, being.userId, req.params.id]);
  
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
      SELECT b.id,
             b.name,
             type,
             image,
             description,
             power,
             is_good as "isGood",
             user_id as "userId",
             u.name as "userName"
      FROM   strongest b
      JOIN   users u
      ON     b.user_id = u.id;
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
      SELECT b.id,
             b.name,
             type,
             image,
             description,
             power,
             is_good as "isGood",
             user_id as "userId",
             u.name as "userName"
      FROM   strongest b
      JOIN   users u
      ON     b.user_id = u.id
      WHERE  b.id = $1;
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
      RETURNING id, name, type, image, description, power, is_good as "isGood", user_id as "userId";
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

