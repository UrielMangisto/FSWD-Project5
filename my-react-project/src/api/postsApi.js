// src/api/postsApi.js
import { BASE_URL, fetchData, getNextId } from './apiHelpers';

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