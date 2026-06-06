const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  adminLogin,
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminGetCategories, adminCreateCategory, adminDeleteCategory,
  adminGetSubcategories, adminCreateSubcategory, adminDeleteSubcategory,
  adminGetEnquiries, adminGetContacts,
  adminGetNewsletter, adminDeleteNewsletter,
  adminChangePassword,
} = require('../controllers/adminController');

// Multer for product images / blog images / award images / certificate images
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ── Auth ─────────────────────────────────────────────────────────
router.post('/login', adminLogin);

// All routes below are JWT-protected
router.use(auth);

// ── Products ─────────────────────────────────────────────────────
router.get('/products', adminGetProducts);
router.post('/products', upload.single('image'), adminCreateProduct);
router.put('/products/:id', upload.single('image'), adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

// ── Categories ───────────────────────────────────────────────────
router.get('/categories', adminGetCategories);
router.post('/categories', adminCreateCategory);
router.delete('/categories/:id', adminDeleteCategory);

// ── Subcategories ────────────────────────────────────────────────
router.get('/subcategories', adminGetSubcategories);
router.post('/subcategories', adminCreateSubcategory);
router.delete('/subcategories/:id', adminDeleteSubcategory);

// ── Read-only data views ─────────────────────────────────────────
router.get('/enquiries', adminGetEnquiries);
router.get('/contacts', adminGetContacts);

// ── Newsletter ───────────────────────────────────────────────────
router.get('/newsletter', adminGetNewsletter);
router.delete('/newsletter/:id', adminDeleteNewsletter);

// ── Change password ──────────────────────────────────────────────
router.put('/change-password', adminChangePassword);

module.exports = router;
