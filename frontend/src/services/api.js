const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Builds full URL with optional query parameters.
 */
const buildUrl = (endpoint, params) => {
  let url = `${API_BASE_URL}${endpoint}`;
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }
  return url;
};

/**
 * Central API fetch wrapper with cookie credentials included.
 */
export const api = async (endpoint, options = {}) => {
  const { params, body, ...customOptions } = options;
  const url = buildUrl(endpoint, params);

  const config = {
    method: customOptions.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(customOptions.headers || {})
    },
    ...customOptions
  };

  if (body !== undefined) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (netErr) {
    const err = new Error('Network error. Please check if the server is running.');
    err.status = 0;
    err.isNetworkError = true;
    throw err;
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// Convenience helpers
api.get = (endpoint, params, options = {}) =>
  api(endpoint, { ...options, method: 'GET', params });

api.post = (endpoint, body, options = {}) =>
  api(endpoint, { ...options, method: 'POST', body });

api.put = (endpoint, body, options = {}) =>
  api(endpoint, { ...options, method: 'PUT', body });

api.patch = (endpoint, body, options = {}) =>
  api(endpoint, { ...options, method: 'PATCH', body });

api.delete = (endpoint, options = {}) =>
  api(endpoint, { ...options, method: 'DELETE' });

export { API_BASE_URL };