const { getPool } = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const sendResponse = require('../utils/responseHandler');

// POST /api/admin/login  — replaces AdminLogin.aspx.cs credential check
async function adminLogin(req, res) {
  /* #swagger.tags = ['Admin Auth']
     #swagger.summary = 'Admin login' */
  const { username, password } = req.body;
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM AdminMaster WHERE Username = ?', [username]);

    if (!rows.length) {
      return sendResponse(res, 401, false, 'Invalid credentials', null, 'Invalid credentials');
    }

    const admin = rows[0];
    // If passwords are stored as plain text in DB (original app), compare directly
    // Otherwise use bcrypt.compare for hashed passwords
    const valid = admin.Password === password || await bcrypt.compare(password, admin.Password);
    if (!valid) return sendResponse(res, 401, false, 'Invalid credentials', null, 'Invalid credentials');

    const token = jwt.sign({ id: admin.AdminId, username: admin.Username }, process.env.JWT_SECRET, { expiresIn: '8h' });
    sendResponse(res, 200, true, 'Login successful', { token });
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

// ─── Products CRUD ─────────────────────────────────────────────
async function adminGetProducts(req, res) {
  /* #swagger.tags = ['Admin Products']
     #swagger.summary = 'Get all products (Admin)' */
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM ProductMaster');
    sendResponse(res, 200, true, 'Success', rows);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

async function adminCreateProduct(req, res) {
  /* #swagger.tags = ['Admin Products']
     #swagger.summary = 'Create a product' */
  const { productName, category, subcategory, description, specifications } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
  try {
    const pool = await getPool();
    await pool.execute(
      'INSERT INTO ProductMaster (ProductName, Category, Subcategory, Description, Specifications, ImagePath) VALUES (?, ?, ?, ?, ?, ?)',
      [productName, category, subcategory, description || '', specifications || '', imagePath]
    );
    sendResponse(res, 201, true, 'Product created');
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

async function adminUpdateProduct(req, res) {
  /* #swagger.tags = ['Admin Products']
     #swagger.summary = 'Update a product' */
  const { productName, category, subcategory, description, specifications } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.existingImage || '';
  try {
    const pool = await getPool();
    await pool.execute(
      'UPDATE ProductMaster SET ProductName=?, Category=?, Subcategory=?, Description=?, Specifications=?, ImagePath=? WHERE ProductId=?',
      [productName, category, subcategory, description || '', specifications || '', imagePath, parseInt(req.params.id)]
    );
    sendResponse(res, 200, true, 'Product updated');
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

async function adminDeleteProduct(req, res) {
  /* #swagger.tags = ['Admin Products']
     #swagger.summary = 'Delete a product' */
  try {
    const pool = await getPool();
    await pool.execute('DELETE FROM ProductMaster WHERE ProductId = ?', [parseInt(req.params.id)]);
    sendResponse(res, 200, true, 'Product deleted');
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

// ─── Category CRUD ─────────────────────────────────────────────
async function adminGetCategories(req, res) {
  /* #swagger.tags = ['Admin Categories']
     #swagger.summary = 'Get all categories (Admin)' */
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM CategoryMaster');
    sendResponse(res, 200, true, 'Success', result.recordset);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

async function adminCreateCategory(req, res) {
  /* #swagger.tags = ['Admin Categories']
     #swagger.summary = 'Create a category' */
  const { categoryName } = req.body;
  try {
    const pool = await getPool();
    await pool.execute('INSERT INTO CategoryMaster (CategoryName) VALUES (?)', [categoryName]);
    sendResponse(res, 201, true, 'Category created');
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

async function adminDeleteCategory(req, res) {
  /* #swagger.tags = ['Admin Categories']
     #swagger.summary = 'Delete a category' */
  try {
    const pool = await getPool();
    await pool.execute('DELETE FROM CategoryMaster WHERE CategoryId = ?', [parseInt(req.params.id)]);
    sendResponse(res, 200, true, 'Category deleted');
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

// ─── Subcategory CRUD ──────────────────────────────────────────
async function adminGetSubcategories(req, res) {
  /* #swagger.tags = ['Admin Subcategories']
     #swagger.summary = 'Get all subcategories (Admin)' */
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM SubcategoryMaster');
    sendResponse(res, 200, true, 'Success', rows);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

async function adminCreateSubcategory(req, res) {
  /* #swagger.tags = ['Admin Subcategories']
     #swagger.summary = 'Create a subcategory' */
  const { subcategoryName, categoryName } = req.body;
  try {
    const pool = await getPool();
    await pool.execute(
      'INSERT INTO SubcategoryMaster (SubcategoryName, CategoryName) VALUES (?, ?)',
      [subcategoryName, categoryName]
    );
    sendResponse(res, 201, true, 'Subcategory created');
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

async function adminDeleteSubcategory(req, res) {
  /* #swagger.tags = ['Admin Subcategories']
     #swagger.summary = 'Delete a subcategory' */
  try {
    const pool = await getPool();
    await pool.execute('DELETE FROM SubcategoryMaster WHERE SubcategoryId = ?', [parseInt(req.params.id)]);
    sendResponse(res, 200, true, 'Subcategory deleted');
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

// ─── Read-only views ───────────────────────────────────────────
async function adminGetEnquiries(req, res) {
  /* #swagger.tags = ['Admin Data Views']
     #swagger.summary = 'Get all enquiries' */
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM EnquiryMaster ORDER BY EnquiryId DESC');
    sendResponse(res, 200, true, 'Success', rows);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

async function adminGetContacts(req, res) {
  /* #swagger.tags = ['Admin Data Views']
     #swagger.summary = 'Get all contact messages' */
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM UserMaster ORDER BY UserId DESC');
    sendResponse(res, 200, true, 'Success', rows);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

async function adminGetNewsletter(req, res) {
  /* #swagger.tags = ['Admin Newsletter']
     #swagger.summary = 'Get newsletter subscribers' */
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM NewsletterMaster');
    sendResponse(res, 200, true, 'Success', rows);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

async function adminDeleteNewsletter(req, res) {
  /* #swagger.tags = ['Admin Newsletter']
     #swagger.summary = 'Delete a newsletter subscriber' */
  try {
    const pool = await getPool();
    await pool.execute('DELETE FROM NewsletterMaster WHERE Id = ?', [parseInt(req.params.id)]);
    sendResponse(res, 200, true, 'Unsubscribed');
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

// ─── Change Password ───────────────────────────────────────────
async function adminChangePassword(req, res) {
  /* #swagger.tags = ['Admin Auth']
     #swagger.summary = 'Change admin password' */
  const { currentPassword, newPassword } = req.body;
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM AdminMaster WHERE AdminId = ?', [req.admin.id]);
    const admin = rows[0];
    if (admin.Password !== currentPassword) return sendResponse(res, 401, false, 'Current password incorrect', null, 'Current password incorrect');
    await pool.execute('UPDATE AdminMaster SET Password = ? WHERE AdminId = ?', [newPassword, req.admin.id]);
    sendResponse(res, 200, true, 'Password updated');
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

module.exports = {
  adminLogin,
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminGetCategories, adminCreateCategory, adminDeleteCategory,
  adminGetSubcategories, adminCreateSubcategory, adminDeleteSubcategory,
  adminGetEnquiries, adminGetContacts,
  adminGetNewsletter, adminDeleteNewsletter,
  adminChangePassword,
};
