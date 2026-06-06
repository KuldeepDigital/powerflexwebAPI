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

        console.log('\n--- CategoryMaster Columns ---');
        let catCols = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'CategoryMaster'");
        console.log(catCols.recordset.map(c => c.COLUMN_NAME));

        console.log('\n--- SubcategoryMaster Columns ---');
        let subCols = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'SubcategoryMaster'");
        console.log(subCols.recordset.map(c => c.COLUMN_NAME));

        console.log('\n--- ProductMaster Columns ---');
        let prodCols = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'ProductMaster'");
        console.log(prodCols.recordset.map(c => c.COLUMN_NAME));

        console.log('\n--- Sample Products ---');
        let products = await pool.request().query("SELECT TOP 5 * FROM ProductMaster");
        console.log(products.recordset);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspect();
