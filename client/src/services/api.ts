const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const fetchFromAPI = async (endpoint: string, method: string = 'GET', body: unknown = null) => {
  const token = localStorage.getItem('token');
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const headers: HeadersInit = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    method,
    headers,    
  };

  if (body !== null && body !== undefined) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Server returned ${response.status}: ${response.statusText}`
      }));

      throw new Error(errorData.message || `Request failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
};