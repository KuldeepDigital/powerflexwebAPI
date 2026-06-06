function sendResponse(res, statusCode, success, message, data = null, error = "") {
  let totalCount = 0;
  if (Array.isArray(data)) {
    totalCount = data.length;
  } else if (data !== null && typeof data === 'object') {
    // If data is a single object (e.g. single product), count is 1
    totalCount = 1;
  } else if (data) {
    // Other truthy primitives
    totalCount = 1;
  }

  return res.status(statusCode).json({
    statusCode,
    success,
    message,
    data,
    totalCount,
    error
  });
}

module.exports = sendResponse;
