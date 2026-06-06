const { getPool, sql } = require('../db');

// GET /api/categories  — mirrors Products.aspx.cs Page_Load: Select * from CategoryMaster
async function getCategories(req, res) {
  /* #swagger.tags = ['Public Products']
     #swagger.summary = 'Get all categories' */
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM CategoryMaster');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/products  — mirrors page load + category/subcategory filtering
// Query params: ?category=X&subcategory=Y
async function getProducts(req, res) {
  /* #swagger.tags = ['Public Products']
     #swagger.summary = 'Get all products' */
  try {
    const pool = await getPool();
    const { category, subcategory } = req.query;
    let query = 'SELECT * FROM ProductMaster WHERE 1=1';
    const request = pool.request();
    if (category) {
      query += ' AND Category = @category';
      request.input('category', sql.NVarChar, category);
    }
    if (subcategory) {
      query += ' AND Subcategory = @subcategory';
      request.input('subcategory', sql.NVarChar, subcategory);
    }
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/products/:id  — mirrors ProductDetails.aspx.cs using Session["productid"]
async function getProductById(req, res) {
  /* #swagger.tags = ['Public Products']
     #swagger.summary = 'Get product by ID' */
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, parseInt(req.params.id))
      .query('SELECT * FROM ProductMaster WHERE ProductId = @id');
    if (!result.recordset.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/subcategories?category=X
async function getSubcategories(req, res) {
  /* #swagger.tags = ['Public Products']
     #swagger.summary = 'Get all subcategories' */
  try {
    const pool = await getPool();
    const { category } = req.query;
    const request = pool.request();
    let query = 'SELECT * FROM SubcategoryMaster';
    if (category) {
      query += ' WHERE CategoryName = @category';
      request.input('category', sql.NVarChar, category);
    }
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getCategories, getProducts, getProductById, getSubcategories };
