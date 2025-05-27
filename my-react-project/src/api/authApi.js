import { getUserByUsername, createUser } from './usersApi';

// Authentication API
export const login = async (username, password) => {
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return { success: false, message: 'משתמש לא נמצא' };
    }
    if (user.website !== password) {
      return { success: false, message: 'סיסמה שגויה' };
    }
    return { success: true, user: user, message: 'התחברות בוצעה בהצלחה' };
  } catch (error) {
    return { success: false, message: 'שגיאה בהתחברות' };
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
      website: password,
      name: additionalData.name || '',
      email: additionalData.email || '',
      phone: additionalData.phone || '',
      address: additionalData.address || {},
      company: additionalData.company || {}
    };
    const createdUser = await createUser(newUser);
    return { success: true, user: createdUser, message: 'הרשמה בוצעה בהצלחה' };
  } catch (error) {
    return { success: false, message: 'שגיאה בהרשמה' };
  }
};