import { BASE_URL, fetchData, getNextId } from './apiHelpers';

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