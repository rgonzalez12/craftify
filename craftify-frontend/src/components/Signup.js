import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  
  // Form fields state
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [driversLicenseNumber, setDriversLicenseNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // error handling
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    if (password1 !== password2) {
      setErrors({password2: ["Passwords do not match."]});
      return;
    }

    const data = {
      email,
      username,
      password: password1,
      date_of_birth: dateOfBirth,
      drivers_license_number: driversLicenseNumber,
      country_code: countryCode,
      phone_number: phoneNumber
    };

    api.post('signup/', data)
      .then(() => {
        alert('Signup successful. You can now log in.');
        navigate('/login');
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        } else {
          console.error('Signup failed:', error);
        }
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form 
          className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" 
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          noValidate
        >
          <div className="rounded-md shadow-sm -space-y-px">
            
            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral placeholder-neutral-dark text-neutral-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              {errors.email && errors.email.map((err, i) => <p key={i} className="text-red-500">{err}</p>)}
            </div>
            
            {/* Username Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral placeholder-neutral-dark text-neutral-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              {errors.username && errors.username.map((err, i) => <p key={i} className="text-red-500">{err}</p>)}
            </div>
            
            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Password</label>
              <input
                type="password"
                value={password1}
                onChange={e => setPassword1(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral placeholder-neutral-dark text-neutral-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              {errors.password && errors.password.map((err, i) => <p key={i} className="text-red-500">{err}</p>)}
              <p className="text-sm text-gray-500">Password must meet complexity requirements.</p>
            </div>
            
            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
              <input
                type="password"
                value={password2}
                onChange={e => setPassword2(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral placeholder-neutral-dark text-neutral-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              {errors.password2 && errors.password2.map((err, i) => <p key={i} className="text-red-500">{err}</p>)}
            </div>
            
            {/* Date of Birth Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral placeholder-neutral-dark text-neutral-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              {errors.date_of_birth && errors.date_of_birth.map((err, i) => <p key={i} className="text-red-500">{err}</p>)}
            </div>
            
            {/* Driver's License Number Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Driver's License Number</label>
              <input
                type="text"
                value={driversLicenseNumber}
                onChange={e => setDriversLicenseNumber(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral placeholder-neutral-dark text-neutral-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              {errors.drivers_license_number && errors.drivers_license_number.map((err, i) => <p key={i} className="text-red-500">{err}</p>)}
            </div>
            
            {/* Country Code Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Country Code</label>
              <input
                type="text"
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral placeholder-neutral-dark text-neutral-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              {errors.country_code && errors.country_code.map((err, i) => <p key={i} className="text-red-500">{err}</p>)}
            </div>
            
            {/* Phone Number Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral placeholder-neutral-dark text-neutral-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              {errors.phone_number && errors.phone_number.map((err, i) => <p key={i} className="text-red-500">{err}</p>)}
            </div>
            
          </div>
          <div className="mt-6">
            <button 
              type="submit" 
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;