import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-[#0f1843]"
      style={{
        backgroundImage: "url('/oooscillate.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="bg-white/65 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 border border-[#8cb3e9] backdrop-blur-xl">
        <div className="flex justify-center mb-4">
          <img 
            src="/logo-transparent-svg.svg" 
            alt="QuizUp Logo"
            className="w-auto -my-7 h-full object-contain" 
          />
        </div>

        <div className="mb-6 text-center">
          <p className="mt-2 font-bold text-[#132780]">Create your account to start learning</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#e5496f] text-white rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#132780] font-medium mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-[#8cb3e9] focus:border-[#6a85c4] focus:ring-2 focus:ring-[#e39dae] outline-none transition"
              placeholder="Choose a username"
              required
            />
          </div>
          
          <div>
            <label className="block text-[#132780] font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-[#8cb3e9] focus:border-[#6a85c4] focus:ring-2 focus:ring-[#e39dae] outline-none transition"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-[#132780] font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-[#8cb3e9] focus:border-[#6a85c4] focus:ring-2 focus:ring-[#e39dae] outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#132780] to-[#6a85c4] text-white py-3 rounded-lg hover:from-[#1a3599] hover:to-[#7a92d4] transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#132780]">
            Already have an account?{' '}
            <a href="/login" className="text-[#e5496f] hover:text-[#d43a60] font-semibold transition">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;