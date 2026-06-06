const { getPool, sql } = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// POST /api/admin/login  — replaces AdminLogin.aspx.cs credential check
async function adminLogin(req, res) {
  const { username, password } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('Username', sql.NVarChar, username)
      .query('SELECT * FROM AdminMaster WHERE Username = @Username');

    if (!result.recordset.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = result.recordset[0];
    // If passwords are stored as plain text in DB (original app), compare directly
    // Otherwise use bcrypt.compare for hashed passwords
    const valid = admin.Password === password || await bcrypt.compare(password, admin.Password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.AdminId, username: admin.Username }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── Products CRUD ─────────────────────────────────────────────
async function adminGetProducts(req, res) {
  const pool = await getPool();
  const result = await pool.request().query('SELECT * FROM ProductMaster');
  res.json(result.recordset);
}

async function adminCreateProduct(req, res) {
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
    res.json({ message: 'Product created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function adminUpdateProduct(req, res) {
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
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function adminDeleteProduct(req, res) {
  try {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, parseInt(req.params.id))
      .query('DELETE FROM ProductMaster WHERE ProductId = @id');
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─── Category CRUD ─────────────────────────────────────────────
async function adminGetCategories(req, res) {
  const pool = await getPool();
  const result = await pool.request().query('SELECT * FROM CategoryMaster');
  res.json(result.recordset);
}
async function adminCreateCategory(req, res) {
  const { categoryName } = req.body;
  const pool = await getPool();
  await pool.request().input('CategoryName', sql.NVarChar, categoryName).query('INSERT INTO CategoryMaster (CategoryName) VALUES (@CategoryName)');
  res.json({ message: 'Category created' });
}
async function adminDeleteCategory(req, res) {
  const pool = await getPool();
  await pool.request().input('id', sql.Int, parseInt(req.params.id)).query('DELETE FROM CategoryMaster WHERE CategoryId = @id');
  res.json({ message: 'Category deleted' });
}

// ─── Subcategory CRUD ──────────────────────────────────────────
async function adminGetSubcategories(req, res) {
  const pool = await getPool();
  const result = await pool.request().query('SELECT * FROM SubcategoryMaster');
  res.json(result.recordset);
}
async function adminCreateSubcategory(req, res) {
  const { subcategoryName, categoryName } = req.body;
  const pool = await getPool();
  await pool.request()
    .input('SubcategoryName', sql.NVarChar, subcategoryName)
    .input('CategoryName', sql.NVarChar, categoryName)
    .query('INSERT INTO SubcategoryMaster (SubcategoryName, CategoryName) VALUES (@SubcategoryName, @CategoryName)');
  res.json({ message: 'Subcategory created' });
}
async function adminDeleteSubcategory(req, res) {
  const pool = await getPool();
  await pool.request().input('id', sql.Int, parseInt(req.params.id)).query('DELETE FROM SubcategoryMaster WHERE SubcategoryId = @id');
  res.json({ message: 'Subcategory deleted' });
}

// ─── Read-only views ───────────────────────────────────────────
async function adminGetEnquiries(req, res) {
  const pool = await getPool();
  const result = await pool.request().query('SELECT * FROM EnquiryMaster ORDER BY EnquiryId DESC');
  res.json(result.recordset);
}
async function adminGetContacts(req, res) {
  const pool = await getPool();
  const result = await pool.request().query('SELECT * FROM UserMaster ORDER BY UserId DESC');
  res.json(result.recordset);
}
async function adminGetNewsletter(req, res) {
  const pool = await getPool();
  const result = await pool.request().query('SELECT * FROM NewsletterMaster');
  res.json(result.recordset);
}
async function adminDeleteNewsletter(req, res) {
  const pool = await getPool();
  await pool.request().input('id', sql.Int, parseInt(req.params.id)).query('DELETE FROM NewsletterMaster WHERE Id = @id');
  res.json({ message: 'Unsubscribed' });
}

// ─── Change Password ───────────────────────────────────────────
async function adminChangePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.admin.id)
      .query('SELECT * FROM AdminMaster WHERE AdminId = @id');
    const admin = result.recordset[0];
    if (admin.Password !== currentPassword) return res.status(401).json({ error: 'Current password incorrect' });
    await pool.request()
      .input('id', sql.Int, req.admin.id)
      .input('Password', sql.NVarChar, newPassword)
      .query('UPDATE AdminMaster SET Password = @Password WHERE AdminId = @id');
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
