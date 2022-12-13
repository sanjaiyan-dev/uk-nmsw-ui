const apiVersion = 'v1';
const apiBaseUrl = process.env.NMSW_DATA_API_BASE_URL || 'http://localhost:5000';

export const apiUrl = `${apiBaseUrl}/${apiVersion}`;
