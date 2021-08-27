// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


// DB_NAME
// DB_USER
// DB_PASSWORD
// DB_HOST
// DB_PORT

const { Client } = require('pg')
let client;

function getDbConnection() {
    if (client) {
        return client;
    }
    if (process.env.DB_NAME &&
        process.env.DB_USER &&
        process.env.DB_PASSWORD &&
        process.env.DB_HOST &&
        process.env.DB_PORT)
    {
        throw new Error('Missing required configuration');
    }

    client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
    return client.connect()
        .then(() => {
            return client;
        });
}

function submitRequestToDb() {
    return getDbConnection()
        .then((db) => {
            return client.query('SELECT $1::text as message', ['Hello world!']);
        })
        .then((res) => {
            return res.rows[0].message;
        });
}


export default function handler(req, res) {
    submitRequestToDb()
        .then((data) => {
            res.status(200).json({ dbresponse : data });
        })
        .catch((err) => {
            res.status(500).json({ error : err.message });
        });
}
