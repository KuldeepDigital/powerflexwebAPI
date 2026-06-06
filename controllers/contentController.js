const { getPool, sql } = require('../db');
const sendResponse = require('../utils/responseHandler');

// GET /api/blogs  — mirrors Blogs.aspx.cs: Select * from BlogMaster
async function getBlogs(req, res) {
  /* #swagger.tags = ['Public Content']
     #swagger.summary = 'Get all blogs' */
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM BlogMaster ORDER BY BlogId DESC');
    sendResponse(res, 200, true, 'Success', result.recordset);
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
    const result = await pool.request()
      .input('id', sql.Int, parseInt(req.params.id))
      .query('SELECT * FROM BlogMaster WHERE BlogId = @id');
    if (!result.recordset.length) return sendResponse(res, 404, false, 'Blog not found', null, 'Not found');
    sendResponse(res, 200, true, 'Success', result.recordset[0]);
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
    const result = await pool.request().query('SELECT * FROM AwardMaster');
    sendResponse(res, 200, true, 'Success', result.recordset);
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
    const result = await pool.request().query('SELECT * FROM CertificateMaster');
    sendResponse(res, 200, true, 'Success', result.recordset);
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
    const result = await pool.request().query('SELECT * FROM Vacancies');
    sendResponse(res, 200, true, 'Success', result.recordset);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

module.exports = { getBlogs, getBlogById, getAwards, getCertificates, getCareers };
