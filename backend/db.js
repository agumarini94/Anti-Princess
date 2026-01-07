//aca uno .env y server.js
import pg from 'pg';
import dotenv from 'dotenv'; 

dotenv.config(); 

const { Client } = pg; 
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect()
    .then(() => console.log('conectado a neon'))
    .catch(err => console.error('ERROR'.err.stack));

export default client;
