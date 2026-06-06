const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

console.log('Attempting to connect to:', config.server);

sql.connect(config).then(pool => {
  console.log('Connected successfully!');
  return pool.request().query('SELECT TOP 5 * FROM CategoryMaster');
}).then(result => {
  console.log('Query result:', result.recordset);
  process.exit(0);
}).catch(err => {
  console.error('Connection failed:', err.message);
  process.exit(1);
});
