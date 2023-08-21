const apiVersion = 'v1';
const apiBaseUrl = process.env.NMSW_DATA_API_BASE_URL || 'http://localhost:5000';

// eslint-disable-next-line import/prefer-default-export
export const apiUrl = `${apiBaseUrl}/${apiVersion}`;
export const gaToken = process.env.GA_TOKEN;
// for nmsw-ui when we recevie this variable it comes to us as a string
export const inSiteMaintenance = (process.env.NMSW_MAINTENANCE && process.env.NMSW_MAINTENANCE.toLowerCase()) === 'true' || false;
