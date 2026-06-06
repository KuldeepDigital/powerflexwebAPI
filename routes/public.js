const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const { getCategories, getProducts, getProductById, getSubcategories } = require('../controllers/productsController');
const { getBlogs, getBlogById, getAwards, getCertificates, getCareers } = require('../controllers/contentController');
const { submitContact, submitEnquiry, subscribeNewsletter } = require('../controllers/formsController');

// Multer for enquiry drawings
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Products
router.get('/categories', getCategories);
router.get('/subcategories', getSubcategories);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// Content
router.get('/blogs', getBlogs);
router.get('/blogs/:id', getBlogById);
router.get('/awards', getAwards);
router.get('/certificates', getCertificates);
router.get('/careers', getCareers);

// Forms
router.post('/contact', submitContact);
router.post('/enquiry', upload.single('drawing'), submitEnquiry);
router.post('/newsletter/subscribe', subscribeNewsletter);

module.exports = router;
