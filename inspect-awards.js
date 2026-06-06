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

async function inspect() {
    try {
        let pool = await sql.connect(config);
        console.log('Connected!');

        console.log('\n--- AwardsMaster Columns ---');
        let awardCols = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'AwardsMaster'");
        console.log(awardCols.recordset.map(c => c.COLUMN_NAME));

        console.log('\n--- Sample Awards ---');
        let awards = await pool.request().query("SELECT TOP 5 * FROM AwardsMaster");
        console.log(awards.recordset);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspect();
