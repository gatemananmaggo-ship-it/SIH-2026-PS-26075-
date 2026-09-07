const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const ML_SERVICE_API_KEY = process.env.ML_SERVICE_API_KEY || '';

/**
 * Call the FastAPI ML optimizer service.
 *
 * @param {Array} trainers  - Array of trainer objects matching the ML Trainer schema
 * @param {Array} subjects  - Array of subject objects matching the ML Subject schema
 * @returns {Promise<Object>} The ML service response
 */
async function optimizeAssignment(trainers, subjects) {
  if (!ML_SERVICE_API_KEY) {
    throw new Error('ML_SERVICE_API_KEY is not configured in environment variables.');
  }

  const url = `${ML_SERVICE_URL}/api/v1/optimize-assignment`;

  try {
    const response = await axios.post(
      url,
      { trainers, subjects },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-ML-Service-Key': ML_SERVICE_API_KEY,
        },
        timeout: 15000, // 15 second timeout
      }
    );
    return response.data;
  } catch (err) {
    if (err.response) {
      // ML service returned an error response
      const status = err.response.status;
      const detail = err.response.data?.detail || 'ML service error';

      if (status === 401) {
        throw new Error('ML service authentication failed. Check ML_SERVICE_API_KEY.');
      }
      if (status === 400) {
        throw new Error(`ML service rejected request: ${detail}`);
      }
      if (status === 422) {
        throw new Error(`ML service validation error: ${JSON.stringify(err.response.data)}`);
      }
      throw new Error(`ML service returned HTTP ${status}: ${detail}`);
    }

    if (err.code === 'ECONNREFUSED') {
      throw new Error('ML service is not running. Start it with: uvicorn app:app --host 127.0.0.1 --port 8000');
    }
    if (err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED') {
      throw new Error('ML service request timed out.');
    }

    throw new Error(`ML service unreachable: ${err.message}`);
  }
}

module.exports = { optimizeAssignment };
