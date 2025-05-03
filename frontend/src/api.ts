const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export function apiUrl(path: string) {
  // If the path is for uploads, do not prepend /api/v1
  if (path.startsWith('/uploads/')) {
    return `${API_BASE_URL}${path}`;
  }
  // Otherwise, prepend /api/v1
  return `${API_BASE_URL}/api/v1${path}`;
} 