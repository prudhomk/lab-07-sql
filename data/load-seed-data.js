/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import strongest from './data.js';

run();

async function run() {

  try {

    await Promise.all(
      strongest.map(being => {
        return client.query(`
          INSERT INTO strongest (name, type, description, power, is_good)
          VALUES ($1, $2, $3, $4, $5);
        `,
        [being.name, being.type, being.description, being.power, being.isGood]);
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