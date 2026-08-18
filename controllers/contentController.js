const { getPool } = require('../db');
const sendResponse = require('../utils/responseHandler');

// GET /api/blogs  — mirrors Blogs.aspx.cs: Select * from BlogMaster
async function getBlogs(req, res) {
  /* #swagger.tags = ['Public Content']
     #swagger.summary = 'Get all blogs' */
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM BlogMaster ORDER BY BlogId DESC');
    sendResponse(res, 200, true, 'Success', rows);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

// GET /api/blogs/:id  — mirrors BlogDetails.aspx.cs using Session["blogid"]
async function getBlogById(req, res) {
  /* #swagger.tags = ['Public Content']
     #swagger.summary = 'Get blog by ID' */
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM BlogMaster WHERE BlogId = ?', [parseInt(req.params.id)]);
    if (!rows.length) return sendResponse(res, 404, false, 'Blog not found', null, 'Not found');
    sendResponse(res, 200, true, 'Success', rows[0]);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

// GET /api/awards  — mirrors UserAwards.aspx.cs
async function getAwards(req, res) {
  /* #swagger.tags = ['Public Content']
     #swagger.summary = 'Get all awards' */
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM AwardMaster');
    sendResponse(res, 200, true, 'Success', rows);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

// GET /api/certificates  — mirrors UserCertificates.aspx.cs
async function getCertificates(req, res) {
  /* #swagger.tags = ['Public Content']
     #swagger.summary = 'Get all certificates' */
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM CertificateMaster');
    sendResponse(res, 200, true, 'Success', rows);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

// GET /api/careers
async function getCareers(req, res) {
  /* #swagger.tags = ['Public Content']
     #swagger.summary = 'Get all careers' */
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM Vacancies');
    sendResponse(res, 200, true, 'Success', rows);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

module.exports = { getBlogs, getBlogById, getAwards, getCertificates, getCareers };
