export default {}

//apiUrlUpload,
var apiUrl;

export const ENV = 'local';
export const ENV_LOCAL = 'local';

// if (location.hostname === "localhost") {
//   apiUrl = 'http://localhost:8084';
// } else {
  apiUrl = 'https://localhost:8084';
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
export const SAMPLE_TEACHER_IMPORT_LINK = 'https://cache.giaohangtietkiem.vn/d/1724eaabb2a4faab9bf16e52a63c475c.xlsx';
export const SAMPLE_GROUP_TEACHER_IMPORT_LINK = 'https://cache.giaohangtietkiem.vn/d/1724eaabb2a4faab9bf16e52a63c475c.xlsx';
export const SAMPLE_CLASS_IMPORT_LINK = 'https://cache.giaohangtietkiem.vn/d/1724eaabb2a4faab9bf16e52a63c475c.xlsx';
export const SAMPLE_STUDENT_PROJECT_IMPORT_LINK = 'https://cache.giaohangtietkiem.vn/d/1724eaabb2a4faab9bf16e52a63c475c.xlsx';

