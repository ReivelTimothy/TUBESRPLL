const API_URL = 'http://localhost:5000';

export const fetchFromAPI = async (endpoint: string, method: string = 'GET', body: any = null) => {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config: RequestInit = {
    method,
    headers,
  };

  // Hanya tambahkan body jika method BUKAN GET atau DELETE
  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    // Memastikan endpoint diawali dengan /
    const safeEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${API_URL}${safeEndpoint}`, config);

    const data = await response.json();

    if (!response.ok) {
      // Ambil pesan error dari backend jika ada, jika tidak pakai pesan default
      throw new Error(data.message || `Error ${response.status}: Terjadi kesalahan pada server`);
    }

    return data;
  } catch (error: any) {
    // Log error untuk mempermudah debugging saat Tubes
    console.error("API Error:", error.message);
    throw error; 
  }
};