/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import strongest from './data.js';
import users from './users.js';
run();

async function run() {

  try {

    const data = await Promise.all(
      users.map(user => {
        return client.query(`
          INSERT INTO users (name, email, password)
          VALUES ($1, $2, $3)
          RETURNING *;
          `,
        [user.name, user.email, user.password]);
      })
    
    );

    const user = data[0].rows[0];
    
    await Promise.all(
      strongest.map(being => {
        return client.query(`
          INSERT INTO strongest (name, type, description, power, is_good, user_id)
          VALUES ($1, $2, $3, $4, $5, $6);
        `,
        [being.name, being.type, being.description, being.power, being.isGood, user.id]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
}