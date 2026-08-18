const { getPool } = require('../db');
const { sendMail } = require('../mailer');
const path = require('path');
const sendResponse = require('../utils/responseHandler');

// POST /api/contact  — mirrors ContactUs.aspx.cs submitButton_Click
async function submitContact(req, res) {
  /* #swagger.tags = ['Public Forms']
     #swagger.summary = 'Submit a contact form' */
  const { name, emailId, contactNo, companyName, designation } = req.body;
  try {
    const pool = await getPool();
    await pool.execute(
      'CALL InsertUser(?, ?, ?, ?, ?)',
      [name, emailId, contactNo, companyName, designation]
    );

    await sendMail({
      subject: 'WEBSITE INQUIRY',
      html: `From ContactUs Form<br>Name: ${name}<br>Email Id: ${emailId}<br>Contact No: ${contactNo}<br>Company Name: ${companyName}<br>Designation: ${designation}`,
    });

    sendResponse(res, 200, true, 'Thank You, we will contact you soon!');
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

// POST /api/enquiry  — mirrors Enquiry.aspx.cs submitButton_Click (with file upload via multer)
async function submitEnquiry(req, res) {
  /* #swagger.tags = ['Public Forms']
     #swagger.summary = 'Submit a product enquiry' */
  const {
    name, emailId, contactNo, companyName, productName,
    size, temperature, application, media, pressure,
    length, fittingsOne, fittingsTwo, qty, remarks,
  } = req.body;
  const drawingPath = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const pool = await getPool();
    await pool.execute(
      'CALL InsertEnquiry(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, emailId, contactNo, companyName, productName, size, temperature, application, media, pressure, length, fittingsOne, fittingsTwo, drawingPath, qty, remarks]
    );

    const attachments = req.file
      ? [{ filename: req.file.originalname, path: req.file.path }]
      : [];

    await sendMail({
      subject: 'WEBSITE INQUIRY',
      html: `From Enquiry Form<br>Name: ${name}<br>Email Id: ${emailId}<br>Contact No: ${contactNo}<br>Company Name: ${companyName}<br>ProductName: ${productName}<br>Size: ${size}<br>Temperature: ${temperature}<br>Application: ${application}<br>Media: ${media}<br>Pressure: ${pressure}<br>Length: ${length}<br>FittingsOne: ${fittingsOne}<br>FittingsTwo: ${fittingsTwo}<br>Qty: ${qty}<br>Remarks: ${remarks}`,
      attachments,
    });

    sendResponse(res, 200, true, 'Thank You, we will contact you soon!');
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

// POST /api/newsletter/subscribe  — mirrors UserMaster.Master subscribeLinkButton_Click
async function subscribeNewsletter(req, res) {
  /* #swagger.tags = ['Public Forms']
     #swagger.summary = 'Subscribe to newsletter' */
  const { emailId } = req.body;
  if (!emailId) return sendResponse(res, 400, false, 'Email is required', null, 'Email is required');
  try {
    const pool = await getPool();
    // Check if already subscribed
    const [rows] = await pool.execute('SELECT * FROM NewsletterMaster WHERE EmailId = ?', [emailId]);
    if (rows.length > 0) {
      return sendResponse(res, 200, true, 'Already subscribed!');
    }
    await pool.execute('INSERT INTO NewsletterMaster (EmailId) VALUES (?)', [emailId]);
    sendResponse(res, 200, true, 'Subscribed successfully!');
  } catch (err) {
    sendResponse(res, 500, false, 'Internal Server Error', null, err.message);
  }
}

module.exports = { submitContact, submitEnquiry, subscribeNewsletter };
