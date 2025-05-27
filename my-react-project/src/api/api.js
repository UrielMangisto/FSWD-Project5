// src/api/api.js
const BASE_URL = 'http://localhost:3001';

// Helper function to get next available ID
const getNextId = async (endpoint) => {
  try {
    const items = await fetchData(`${BASE_URL}/${endpoint}`);
    if (items.length === 0) return 1;
    // Make sure we parse all IDs as integers and find the max
    const maxId = Math.max(...items.map(item => {
      const id = parseInt(item.id);
      return isNaN(id) ? 0 : id;
    }));
    return maxId + 1;
  } catch (error) {
    console.error('Error getting next ID:', error);
    return 1; // Start from 1, not timestamp
  }
};

// Helper function for fetch with error handling
const fetchData = async (url, options = {}) => {
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
        userId: item.userId ? parseInt(item.userId) : item.userId,
        postId: item.postId ? parseInt(item.postId) : item.postId,
        albumId: item.albumId ? parseInt(item.albumId) : item.albumId
      }));
    } else if (data && data.id) {
      return {
        ...data,
        id: parseInt(data.id),
        userId: data.userId ? parseInt(data.userId) : data.userId,
        postId: data.postId ? parseInt(data.postId) : data.postId,
        albumId: data.albumId ? parseInt(data.albumId) : data.albumId
      };
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Users API
export const getUsers = async () => {
  return await fetchData(`${BASE_URL}/users`);
};

export const getUser = async (id) => {
  return await fetchData(`${BASE_URL}/users/${id}`);
};

export const getUserByUsername = async (username) => {
  const users = await fetchData(`${BASE_URL}/users?username=${username}`);
  return users[0] || null;
};

export const createUser = async (userData) => {
  // Ensure user gets proper integer ID
  const nextId = await getNextId('users');
  const userWithId = { ...userData, id: nextId };
  
  return await fetchData(`${BASE_URL}/users`, {
    method: 'POST',
    body: JSON.stringify(userWithId)
  });
};

// Authentication
export const login = async (username, password) => {
  try {
    const user = await getUserByUsername(username);
    
    if (!user) {
      return { success: false, message: 'משתמש לא נמצא' };
    }
    
    // Check password using website field
    if (user.website !== password) {
      return { success: false, message: 'סיסמה שגויה' };
    }
    
    return { 
      success: true, 
      user: user, 
      message: 'התחברות בוצעה בהצלחה' 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'שגיאה בהתחברות' 
    };
  }
};

export const register = async (username, password, verifyPassword, additionalData = {}) => {
  try {
    if (password !== verifyPassword) {
      return { success: false, message: 'הסיסמאות לא תואמות' };
    }

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return { success: false, message: 'שם המשתמש כבר קיים' };
    }

    const newUser = {
      username,
      website: password, // Store password in website field
      name: additionalData.name || '',
      email: additionalData.email || '',
      phone: additionalData.phone || '',
      address: additionalData.address || {},
      company: additionalData.company || {}
    };

    const createdUser = await createUser(newUser);
    
    return { 
      success: true, 
      user: createdUser, 
      message: 'הרשמה בוצעה בהצלחה' 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'שגיאה בהרשמה' 
    };
  }
};

// Todos API
export const getUserTodos = async (userId) => {
  return await fetchData(`${BASE_URL}/todos?userId=${userId}`);
};

export const createTodo = async (todoData) => {
  // Generate the next ID manually
  const nextId = await getNextId('todos');
  
  // Create the todo object with explicit integer ID
  const todoWithId = { 
    userId: parseInt(todoData.userId),
    id: nextId, // This should be an integer from getNextId
    title: todoData.title,
    completed: todoData.completed
  };
  
  console.log('Creating todo with:', todoWithId);
  console.log('ID type:', typeof todoWithId.id, 'ID value:', todoWithId.id);
  
  const result = await fetchData(`${BASE_URL}/todos`, {
    method: 'POST',
    body: JSON.stringify(todoWithId)
  });
  
  console.log('Server returned:', result);
  console.log('Returned ID type:', typeof result.id, 'Returned ID value:', result.id);
  
  return result;
};

export const updateTodo = async (id, todoData) => {
  const updatedTodo = {
    userId: parseInt(todoData.userId), // First: userId
    id: parseInt(id),                 // Second: id
    title: todoData.title,            // Third: title
    completed: todoData.completed     // Fourth: completed
  };
  
  return await fetchData(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedTodo)
  });
};

export const deleteTodo = async (id) => {
  return await fetchData(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE'
  });
};

export const toggleTodoCompleted = async (id, completed) => {
  return await fetchData(`${BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed })
  });
};

// Posts API
export const getUserPosts = async (userId) => {
  return await fetchData(`${BASE_URL}/posts?userId=${userId}`);
};

export const getPost = async (id) => {
  return await fetchData(`${BASE_URL}/posts/${id}`);
};

export const createPost = async (postData) => {
  const nextId = await getNextId('posts');
  const postWithId = { 
    userId: parseInt(postData.userId),
    id: nextId,
    title: postData.title,
    body: postData.body
  };
  
  return await fetchData(`${BASE_URL}/posts`, {
    method: 'POST',
    body: JSON.stringify(postWithId)
  });
};

export const updatePost = async (id, postData) => {
  const updatedPost = {
    ...postData,
    id: parseInt(id),
    userId: parseInt(postData.userId)
  };
  
  return await fetchData(`${BASE_URL}/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedPost)
  });
};

export const deletePost = async (id) => {
  return await fetchData(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE'
  });
};

// Comments API
export const getPostComments = async (postId) => {
  return await fetchData(`${BASE_URL}/comments?postId=${postId}`);
};

export const createComment = async (commentData) => {
  const nextId = await getNextId('comments');
  const commentWithId = { 
    postId: parseInt(commentData.postId),
    id: nextId,
    name: commentData.name,
    email: commentData.email,
    body: commentData.body
  };
  
  return await fetchData(`${BASE_URL}/comments`, {
    method: 'POST',
    body: JSON.stringify(commentWithId)
  });
};

export const updateComment = async (id, commentData) => {
  const updatedComment = {
    ...commentData,
    id: parseInt(id),
    postId: parseInt(commentData.postId)
  };
  
  return await fetchData(`${BASE_URL}/comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedComment)
  });
};

export const deleteComment = async (id) => {
  return await fetchData(`${BASE_URL}/comments/${id}`, {
    method: 'DELETE'
  });
};

// Albums API
export const getUserAlbums = async (userId) => {
  return await fetchData(`${BASE_URL}/albums?userId=${userId}`);
};

export const getAlbum = async (id) => {
  return await fetchData(`${BASE_URL}/albums/${id}`);
};

export const createAlbum = async (albumData) => {
  const nextId = await getNextId('albums');
  const albumWithId = { 
    userId: parseInt(albumData.userId),
    id: nextId,
    title: albumData.title
  };
  
  return await fetchData(`${BASE_URL}/albums`, {
    method: 'POST',
    body: JSON.stringify(albumWithId)
  });
};

export const updateAlbum = async (id, albumData) => {
  const updatedAlbum = {
    ...albumData,
    id: parseInt(id),
    userId: parseInt(albumData.userId)
  };
  
  return await fetchData(`${BASE_URL}/albums/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedAlbum)
  });
};

export const deleteAlbum = async (id) => {
  return await fetchData(`${BASE_URL}/albums/${id}`, {
    method: 'DELETE'
  });
};

// Photos API
export const getAlbumPhotos = async (albumId) => {
  return await fetchData(`${BASE_URL}/photos?albumId=${albumId}`);
};

export const createPhoto = async (photoData) => {
  const nextId = await getNextId('photos');
  const photoWithId = { 
    albumId: parseInt(photoData.albumId),
    id: nextId,
    title: photoData.title,
    url: photoData.url,
    thumbnailUrl: photoData.thumbnailUrl
  };
  
  return await fetchData(`${BASE_URL}/photos`, {
    method: 'POST',
    body: JSON.stringify(photoWithId)
  });
};

export const updatePhoto = async (id, photoData) => {
  const updatedPhoto = {
    ...photoData,
    id: parseInt(id),
    albumId: parseInt(photoData.albumId)
  };
  
  return await fetchData(`${BASE_URL}/photos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedPhoto)
  });
};

export const deletePhoto = async (id) => {
  return await fetchData(`${BASE_URL}/photos/${id}`, {
    method: 'DELETE'
  });
};