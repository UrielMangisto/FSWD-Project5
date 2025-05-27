import { BASE_URL, fetchData, getNextId } from './apiHelpers';

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