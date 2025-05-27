// src/api/albumsApi.js
import { BASE_URL, fetchData, getNextId } from './apiHelpers';

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