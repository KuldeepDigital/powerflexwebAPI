const { getPool, sql } = require('../db');

// GET /api/blogs  — mirrors Blogs.aspx.cs: Select * from BlogMaster
async function getBlogs(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM BlogMaster ORDER BY BlogId DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/blogs/:id  — mirrors BlogDetails.aspx.cs using Session["blogid"]
async function getBlogById(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, parseInt(req.params.id))
      .query('SELECT * FROM BlogMaster WHERE BlogId = @id');
    if (!result.recordset.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/awards  — mirrors UserAwards.aspx.cs
async function getAwards(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM AwardMaster');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/certificates  — mirrors UserCertificates.aspx.cs
async function getCertificates(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM CertificateMaster');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/careers
async function getCareers(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM VacancyMaster');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getBlogs, getBlogById, getAwards, getCertificates, getCareers };
