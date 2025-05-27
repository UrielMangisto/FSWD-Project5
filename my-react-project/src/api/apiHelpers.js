export const BASE_URL = 'http://localhost:3001';

export const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    // FORCE all IDs to be integers after receiving from server
    if (Array.isArray(data)) {
      return data.map(item => ({
        ...item,
        id: parseInt(item.id),
        userId: item.userId ? parseInt(item.userId) : item.userId
      }));
    } else if (data && data.id) {
      return {
        ...data,
        id: parseInt(data.id),
        userId: data.userId ? parseInt(data.userId) : data.userId
      };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getNextId = async (endpoint) => {
  try {
    const items = await fetchData(`${BASE_URL}/${endpoint}`);
    if (items.length === 0) return 1;
    const maxId = Math.max(...items.map(item => {
      const id = parseInt(item.id);
      return isNaN(id) ? 0 : id;
    }));
    return maxId + 1;
  } catch (error) {
    console.error('Error getting next ID:', error);
    return 1;
  }
};