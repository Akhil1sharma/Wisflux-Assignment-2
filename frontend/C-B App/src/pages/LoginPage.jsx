import React from 'react';
import InputForm from '../components/InputForm';
import '../App.css'; // make sure global CSS is imported

const LoginPage = () => {
  return (
    <div className="login-page-wrapper">
      <InputForm setIsOpen={() => {}} />
    </div>
  );
};

export default LoginPage;
