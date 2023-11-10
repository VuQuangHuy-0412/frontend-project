export default {}

//apiUrlUpload,
var apiUrl;

export const ENV = 'local';
export const ENV_LOCAL = 'local';

// if (location.hostname === "localhost") {
//   apiUrl = 'http://localhost:8084';
// } else {
  apiUrl = 'https://ewallet-admin-dev.ghtklab.com';
  // apiUrl = 'http://172.16.50.74:8084';
// }
// if (ENV == 'product') {
//   apiUrl = "http://localhost:8086"
// } else if (ENV == 'test') {
//   apiUrl = ""
// } else if (ENV == ENV_LOCAL) {
//   apiUrl = "http://localhost:8086"
// }

export const API_URL = apiUrl;

export const SUCCESS = 200;

export const SERVER_ERROR = 500;

export const NO_DEFAULT_ERROR_MSG = 'no_msg'

export const PAGINATION_OPTIONS = [
  { text: 10 },
  { text: 20 },
  { text: 50 },
  { text: 100 }
];

export const LOGO_TELECOM_PROVIDER = {
  VIETTEL: 'https://cache.giaohangtietkiem.vn/d/5e0127abcf65444f84c35b4a82e21312.png',
  MOBIFONE: 'https://cache.giaohangtietkiem.vn/d/5671996293fa4813bdaf7f13e249b6c8.png',
  VINAPHONE: 'https://cache.giaohangtietkiem.vn/d/3a3cce8929e7409aa758977f37a47ab9.png',
  GMOBILE: 'https://cache.giaohangtietkiem.vn/d/0c246d7d142e492e80fddd11c9304d95.jpg?width=450&height=280',
  VNMOBILE: 'https://cache.giaohangtietkiem.vn/d/53f9c6bf1f764772b7b1e6118d12ea44.png',
}
