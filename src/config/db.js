const {Pool}=require('pg');
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "myapp",
  password: "Sayali",
  port: 5432,
});

module.exports = pool;