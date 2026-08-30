import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Field cannot be empty.';
    if (!formData.password) newErrors.password = 'Field cannot be empty.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data);
      navigate('/suppliers');
    } catch (error) {
      setErrors({ general: 'Incorrect email or password. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#ECECEC] flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[410px] min-h-[585px] bg-[#F8F8F8] rounded-2xl px-11 py-12 shadow-sm flex flex-col"
      >
        <h1 className="text-[42px] leading-none font-bold text-center text-black mt-4">
          Login
        </h1>
        <p className="text-[#777777] text-center text-base mt-4 mb-11">
          Your best business contact manager
        </p>

        <label className="block mb-2 text-base text-gray-900">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full h-12 px-4 bg-[#DCEBED] rounded-xl border border-transparent outline-none focus:border-[#94AEB1]"
        />
        {errors.email ? (
          <p className="text-red-600 text-sm mt-1 mb-4">*{errors.email}</p>
        ) : (
          <div className="h-6 mb-1" />
        )}

        <label className="block mb-2 text-base text-gray-900">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full h-12 px-4 bg-[#DCEBED] rounded-xl border border-transparent outline-none focus:border-[#94AEB1]"
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">*{errors.password}</p>
        )}

        {errors.general && (
          <p className="text-red-600 text-sm text-center mt-3">
            {errors.general}
          </p>
        )}

        <div className="mt-auto flex justify-center pt-8">
          <button
            type="submit"
            className="min-w-[150px] h-14 bg-black text-white px-8 rounded-full text-lg font-medium hover:bg-gray-800"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
