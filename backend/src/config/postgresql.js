
const escape= require('pg-escape')
const { Pool, Client } = require('pg')
// require('dotenv').config()
const connectionPool = new Pool({
  host: `localhost`,
  user: `amit`,
  password: `password@2020`,
  database: `db`,
  port: 5432
})



connectionPool.connect().then(
    module.exports = {
            connectionPool: connectionPool,
            escape: escape
        }
    ).catch((err) => {throw new Error(err)});