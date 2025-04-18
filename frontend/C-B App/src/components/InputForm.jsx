import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function InputForm({ setIsOpen }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isSignUp ? 'user/register' : 'user/login';  

    try {
      const res = await axios.post(`http://localhost:5000/user/${endpoint}`, { 
        email,
        password,
      });

      // JWT Token 
      localStorage.setItem('token', res.data.token);  // Store token in localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));  // Store user data in localStorage

      // Redirect after successful login/signup
      navigate('/');  //

    } catch (err) {
      // Error handling
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="form space-y-4 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto"
      onSubmit={handleOnSubmit}
    >
      <h2 className="text-xl font-semibold text-center">
        {isSignUp ? 'Create an Account' : 'Login to Your Account'}
      </h2>

      <div className="form-control">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          className="input w-full px-3 py-2 border border-gray-300 rounded"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-control">
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          className="input w-full px-3 py-2 border border-gray-300 rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
      >
        {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
      </button>

      <p
        className="text-center text-sm mt-2 cursor-pointer text-blue-500"
        onClick={() => setIsSignUp((prev) => !prev)}
      >
        {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
      </p>
    </form>
  );
}
