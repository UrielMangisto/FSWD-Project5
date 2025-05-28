export const BASE_URL = 'http://localhost:3001';

export const fetchData = async (url, options = {}) => {
  try {
    console.log(`fetchData: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    // אם זה DELETE request, ייתכן שלא יהיה JSON בתגובה
    if (options.method === 'DELETE') {
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        // תגובה ריקה = מחיקה מוצלחת
        return { success: true };
      }
      try {
        return JSON.parse(responseText);
      } catch (e) {
        // אם לא ניתן לפרס כ-JSON, זה עדיין הצלחה
        return { success: true };
      }
    }

    if (!response.ok) {
      console.error(`HTTP Error: ${response.status} - ${response.statusText}`);
      
      // נסה לקרוא את הודעת השגיאה מהשרת
      let errorMessage = `HTTP Error: ${response.status}`;
      try {
        const errorData = await response.text();
        if (errorData) {
          errorMessage += ` - ${errorData}`;
        }
      } catch (e) {
        // אם לא ניתן לקרוא את השגיאה, נשתמש בהודעה הכללית
      }
      
      throw new Error(errorMessage);
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