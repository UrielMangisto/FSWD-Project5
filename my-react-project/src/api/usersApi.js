// src/api/usersApi.js
import { BASE_URL, fetchData, getNextId } from './apiHelpers';

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
  const nextId = await getNextId('users');
  const userWithId = { ...userData, id: nextId };
  return await fetchData(`${BASE_URL}/users`, {
    method: 'POST',
    body: JSON.stringify(userWithId)
  });
};

export const updateUser = async (id, userData) => {
  return await fetchData(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...userData, id: parseInt(id) })
  });
};

export const deleteUser = async (id) => {
  return await fetchData(`${BASE_URL}/users/${id}`, {
    method: 'DELETE'
  });
};