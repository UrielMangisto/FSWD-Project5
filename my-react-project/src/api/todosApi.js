// src/api/todosApi.js
import { BASE_URL, fetchData, getNextId } from './apiHelpers';

// Todos API
export const getUserTodos = async (userId) => {
  return await fetchData(`${BASE_URL}/todos?userId=${userId}`);
};

export const createTodo = async (todoData) => {
  const nextId = await getNextId('todos');
  const todoWithId = { 
    userId: parseInt(todoData.userId),
    id: nextId,
    title: todoData.title,
    completed: todoData.completed
  };
  return await fetchData(`${BASE_URL}/todos`, {
    method: 'POST',
    body: JSON.stringify(todoWithId)
  });
};

export const updateTodo = async (id, todoData) => {
  const updatedTodo = {
    userId: parseInt(todoData.userId),
    id: parseInt(id),
    title: todoData.title,
    completed: todoData.completed
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