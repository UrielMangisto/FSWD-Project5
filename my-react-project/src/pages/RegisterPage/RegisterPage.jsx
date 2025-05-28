import React, { useState } from 'react';
import { register } from '../../api/authApi'; // ✅ השתמש ב-API קיים
import RegisterStep1 from '../../components/RegisterStep1/RegisterStep1';
import RegisterStep2 from '../../components/RegisterStep2/RegisterStep2';

const RegisterPage = ({ onRegisterSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    verifyPassword: '',
    name: '',
    email: '',
    phone: '',
    website: '',
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: ''
    },
    company: {
      name: '',
      catchPhrase: '',
      bs: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.verifyPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    setLoading(true);

    try {
      // רק בדיקה בסיסית - מעבר לשלב 2
      setStep(2);
    } catch (err) {
      setError('שגיאה בתקשורת עם השרת');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await register(
        formData.username, 
        formData.password, 
        formData.verifyPassword, 
        formData
      );
      
      if (result.success) {
        onRegisterSuccess(result.user);
      } else {
        setError(result.message || 'שגיאה ברישום');
      }
    } catch (err) {
      setError('שגיאה בתקשורת עם השרת');
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <RegisterStep1
        formData={formData}
        error={error}
        loading={loading}
        onChange={handleChange}
        onSubmit={handleStep1Submit}
      />
    );
  }

  return (
    <RegisterStep2
      formData={formData}
      error={error}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleStep2Submit}
      onBack={() => setStep(1)}
    />
  );
};

export default RegisterPage;