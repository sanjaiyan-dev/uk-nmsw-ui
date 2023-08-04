const apiVersion = 'v1';
const apiBaseUrl = process.env.NMSW_DATA_API_BASE_URL || 'http://localhost:5000';

// eslint-disable-next-line import/prefer-default-export
export const apiUrl = `${apiBaseUrl}/${apiVersion}`;
export const gaToken = process.env.GA_TOKEN;
export const inSiteMaintenance = !!JSON.parse(process.env.NMSW_MAINTENANCE || false);
