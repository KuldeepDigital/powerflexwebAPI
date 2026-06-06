const { getPool, sql } = require('../db');
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
    const result = await pool.request()
      .input('Username', sql.NVarChar, username)
      .query('SELECT * FROM AdminMaster WHERE Username = @Username');

    if (!result.recordset.length) {
      return sendResponse(res, 401, false, 'Invalid credentials', null, 'Invalid credentials');
    }

    const admin = result.recordset[0];
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
    const result = await pool.request().query('SELECT * FROM ProductMaster');
    sendResponse(res, 200, true, 'Success', result.recordset);
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
    await pool.request()
      .input('ProductName', sql.NVarChar, productName)
      .input('Category', sql.NVarChar, category)
      .input('Subcategory', sql.NVarChar, subcategory)
      .input('Description', sql.NVarChar, description || '')
      .input('Specifications', sql.NVarChar, specifications || '')
      .input('ImagePath', sql.NVarChar, imagePath)
      .query('INSERT INTO ProductMaster (ProductName, Category, Subcategory, Description, Specifications, ImagePath) VALUES (@ProductName, @Category, @Subcategory, @Description, @Specifications, @ImagePath)');
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
    await pool.request()
      .input('id', sql.Int, parseInt(req.params.id))
      .input('ProductName', sql.NVarChar, productName)
      .input('Category', sql.NVarChar, category)
      .input('Subcategory', sql.NVarChar, subcategory)
      .input('Description', sql.NVarChar, description || '')
      .input('Specifications', sql.NVarChar, specifications || '')
      .input('ImagePath', sql.NVarChar, imagePath)
      .query('UPDATE ProductMaster SET ProductName=@ProductName, Category=@Category, Subcategory=@Subcategory, Description=@Description, Specifications=@Specifications, ImagePath=@ImagePath WHERE ProductId=@id');
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
    await pool.request()
      .input('id', sql.Int, parseInt(req.params.id))
      .query('DELETE FROM ProductMaster WHERE ProductId = @id');
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
    await pool.request().input('CategoryName', sql.NVarChar, categoryName).query('INSERT INTO CategoryMaster (CategoryName) VALUES (@CategoryName)');
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
    await pool.request().input('id', sql.Int, parseInt(req.params.id)).query('DELETE FROM CategoryMaster WHERE CategoryId = @id');
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
    const result = await pool.request().query('SELECT * FROM SubcategoryMaster');
    sendResponse(res, 200, true, 'Success', result.recordset);
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
    await pool.request()
      .input('SubcategoryName', sql.NVarChar, subcategoryName)
      .input('CategoryName', sql.NVarChar, categoryName)
      .query('INSERT INTO SubcategoryMaster (SubcategoryName, CategoryName) VALUES (@SubcategoryName, @CategoryName)');
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
    await pool.request().input('id', sql.Int, parseInt(req.params.id)).query('DELETE FROM SubcategoryMaster WHERE SubcategoryId = @id');
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
    const result = await pool.request().query('SELECT * FROM EnquiryMaster ORDER BY EnquiryId DESC');
    sendResponse(res, 200, true, 'Success', result.recordset);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

async function adminGetContacts(req, res) {
  /* #swagger.tags = ['Admin Data Views']
     #swagger.summary = 'Get all contact messages' */
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM UserMaster ORDER BY UserId DESC');
    sendResponse(res, 200, true, 'Success', result.recordset);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

async function adminGetNewsletter(req, res) {
  /* #swagger.tags = ['Admin Newsletter']
     #swagger.summary = 'Get newsletter subscribers' */
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM NewsletterMaster');
    sendResponse(res, 200, true, 'Success', result.recordset);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

async function adminDeleteNewsletter(req, res) {
  /* #swagger.tags = ['Admin Newsletter']
     #swagger.summary = 'Delete a newsletter subscriber' */
  try {
    const pool = await getPool();
    await pool.request().input('id', sql.Int, parseInt(req.params.id)).query('DELETE FROM NewsletterMaster WHERE Id = @id');
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
    const result = await pool.request()
      .input('id', sql.Int, req.admin.id)
      .query('SELECT * FROM AdminMaster WHERE AdminId = @id');
    const admin = result.recordset[0];
    if (admin.Password !== currentPassword) return sendResponse(res, 401, false, 'Current password incorrect', null, 'Current password incorrect');
    await pool.request()
      .input('id', sql.Int, req.admin.id)
      .input('Password', sql.NVarChar, newPassword)
      .query('UPDATE AdminMaster SET Password = @Password WHERE AdminId = @id');
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
