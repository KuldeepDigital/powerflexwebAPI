const { getPool } = require('../db');
const sendResponse = require('../utils/responseHandler');

// GET /api/categories  — mirrors Products.aspx.cs Page_Load: Select * from CategoryMaster
async function getCategories(req, res) {
  /* #swagger.tags = ['Public Products']
     #swagger.summary = 'Get all categories' */
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM CategoryMaster');
    sendResponse(res, 200, true, 'Success', rows);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
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
    const params = [];
    if (category) {
      query += ' AND Category = ?';
      params.push(category);
    }
    if (subcategory) {
      query += ' AND Subcategory = ?';
      params.push(subcategory);
    }
    const [rows] = await pool.execute(query, params);
    sendResponse(res, 200, true, 'Success', rows);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

// GET /api/products/:id  — mirrors ProductDetails.aspx.cs using Session["productid"]
async function getProductById(req, res) {
  /* #swagger.tags = ['Public Products']
     #swagger.summary = 'Get product by ID' */
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM ProductMaster WHERE ProductId = ?', [parseInt(req.params.id)]);
    if (!rows.length) return sendResponse(res, 404, false, 'Product not found', null, 'Not found');
    sendResponse(res, 200, true, 'Success', rows[0]);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

// GET /api/subcategories?category=X
async function getSubcategories(req, res) {
  /* #swagger.tags = ['Public Products']
     #swagger.summary = 'Get all subcategories' */
  try {
    const pool = await getPool();
    const { category } = req.query;
    let query = 'SELECT * FROM SubcategoryMaster';
    const params = [];
    if (category) {
      query += ' WHERE CategoryName = ?';
      params.push(category);
    }
    const [rows] = await pool.execute(query, params);
    sendResponse(res, 200, true, 'Success', rows);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

module.exports = { getCategories, getProducts, getProductById, getSubcategories };
