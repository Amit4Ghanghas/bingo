
const escape= require('pg-escape')
const { Pool, Client } = require('pg')
// require('dotenv').config()
const connectionPool = new Pool({
  host: `localhost`,
  user: `amit`,
  password: `password@2020`,
  database: `db`,
  port: 5432
  // host: `172.21.0.2`,//(put container ip here, to get -> docker inspect container_id )
  // user: `postgres`,
  // password: `postgres`,
  // database: `bingo`,
  // port: 5432
})



connectionPool.connect().then(
    module.exports = {
            connectionPool: connectionPool,
            escape: escape
        }
    ).catch((err) => {throw new Error(err)});