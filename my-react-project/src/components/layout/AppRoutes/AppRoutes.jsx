import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// עדכון הנתיבים - הוספנו "../../../" כי עברנו תיקייה עמוקה יותר
import LoginPage from '../../../pages/LoginPage/LoginPage';
import RegisterPage from '../../../pages/RegisterPage/RegisterPage';
import HomePage from '../../../pages/HomePage/HomePage';
import UserInfoPage from '../../../pages/UserInfoPage/UserInfoPage';
import TodosPage from '../../../pages/TodosPage/TodosPage';
import PostsPage from '../../../pages/PostsPage/PostsPage';
import AlbumsPage from '../../../pages/AlbumsPage/AlbumPage';

const AppRoutes = ({ currentUser, onLoginSuccess, onLogout }) => {
  // פונקציית עזר ל-route מוגן
  const protectedRoute = (path, Component) => (
    <Route 
      key={path}
      path={path} 
      element={
        currentUser ? 
        <Component currentUser={currentUser} onLogout={onLogout} /> : 
        <Navigate to="/login" replace />
      } 
    />
  );

  // פונקציית עזר ל-route ציבורי
  const publicRoute = (path, Component, props = {}) => (
    <Route 
      key={path}
      path={path} 
      element={
        !currentUser ? 
        <Component {...props} /> : 
        <Navigate to="/home" replace />
      } 
    />
  );

  return (
    <Routes>
      {/* דפי אימות */}
      {publicRoute("/login", LoginPage, { onLoginSuccess })}
      {publicRoute("/register", RegisterPage, { onRegisterSuccess: onLoginSuccess })}

      {/* דפי האפליקציה */}
      {protectedRoute("/home", HomePage)}
      {protectedRoute("/users/:userId/info", UserInfoPage)}
      {protectedRoute("/users/:userId/todos", TodosPage)}
      {protectedRoute("/users/:userId/posts", PostsPage)}
      {protectedRoute("/users/:userId/albums", AlbumsPage)}

      {/* ברירות מחדל */}
      <Route 
        path="/" 
        element={<Navigate to={currentUser ? "/home" : "/login"} replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to={currentUser ? "/home" : "/login"} replace />} 
      />
    </Routes>
  );
};

export default AppRoutes;