import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const { username, email, password, password2 } = formData;
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert('Passwords do not match');
    } else {
      try {
        const newUser = { username, email, password };
        const res = await axios.post('http://localhost:5000/api/auth/signup', newUser);
        localStorage.setItem('token', res.data.token);
        console.log('Registered successfully');
        navigate('/dashboard');
      } catch (err) {
        console.error(err.response.data);
        alert('Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#191414]">
      <div className="bg-[#282828] p-8 rounded-lg shadow-xl w-full max-w-sm transform transition duration-300 hover:scale-105">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Register</h1>
        <form onSubmit={onSubmit}>
          <div className="mb-5">
            <label htmlFor="username" className="block text-[#B3B3B3] text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              required
              className="shadow-sm appearance-none border border-gray-600 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#1DB954] bg-gray-700 transition duration-200"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="block text-[#B3B3B3] text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="shadow-sm appearance-none border border-gray-600 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#1DB954] bg-gray-700 transition duration-200"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block text-[#B3B3B3] text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="shadow-sm appearance-none border border-gray-600 rounded w-full py-3 px-4 text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-[#1DB954] bg-gray-700 transition duration-200"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password2" className="block text-[#B3B3B3] text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={password2}
              onChange={onChange}
              required
              className="shadow-sm appearance-none border border-gray-600 rounded w-full py-3 px-4 text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-[#1DB954] bg-gray-700 transition duration-200"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-[#1DB954] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105"
            >
              Register
            </button>
            <Link to="/login" className="inline-block align-baseline font-bold text-sm text-[#1DB954] hover:text-green-400 transition duration-200">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

