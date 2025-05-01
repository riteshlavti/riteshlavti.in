const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export function apiUrl(path: string) {
  // path should start with a slash, e.g. '/blog/'
  return `${API_BASE_URL}${path}`;
} 