import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    bio: '',
    dateOfBirth: '',
    profilePicture: null,
    website: '',
    email: '',
    countryCode: '',
    address: '',
    phoneNumber: ''
  });

  const [profileFormErrors, setProfileFormErrors] = useState({});
  const [contactFormErrors, setContactFormErrors] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`user/${id}/`);
        const user = response.data;
        setFormData({
          bio: user.bio || '',
          dateOfBirth: user.date_of_birth || '',
          website: user.website || '',
          email: user.email || '',
          countryCode: user.country_code || '',
          address: user.address || '',
          phoneNumber: user.phone_number || ''
        });
      } catch (err) {
        setError('Error fetching user data.');
        setMessages(['Error fetching user data.']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      profilePicture: e.target.files[0]
    }));
  };

  const validateForm = () => {
    const errors = {
      profile: {},
      contact: {}
    };

    // Profile validation
    if (!formData.bio) errors.profile.bio = 'Bio is required';
    if (!formData.dateOfBirth) errors.profile.dateOfBirth = 'Date of birth is required';
    if (formData.website && !formData.website.startsWith('http')) {
      errors.profile.website = 'Website must start with http:// or https://';
    }

    // Contact validation
    if (!formData.email) errors.contact.email = 'Email is required';
    if (!formData.phoneNumber) errors.contact.phoneNumber = 'Phone number is required';
    if (!formData.countryCode) errors.contact.countryCode = 'Country code is required';
    if (!formData.address) errors.contact.address = 'Address is required';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([]);
    setProfileFormErrors({});
    setContactFormErrors({});
    setIsLoading(true);

    const errors = validateForm();
    if (Object.keys(errors.profile).length > 0 || Object.keys(errors.contact).length > 0) {
      setProfileFormErrors(errors.profile);
      setContactFormErrors(errors.contact);
      setIsLoading(false);
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        submitData.append(key, formData[key]);
      }
    });

    try {
      await api.put(`user/${id}/`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessages(['Profile updated successfully']);
      navigate(`/profile/${id}`);
    } catch (err) {
      setError(err.message);
      setMessages(['Error updating profile']);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      
      {messages.length > 0 && (
        <div className="mb-4">
          {messages.map((message, index) => (
            <div key={index} className="p-4 bg-blue-100 text-blue-700 rounded">
              {message}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          
          <div>
            <label className="block mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {profileFormErrors.bio && (
              <p className="text-red-500 text-sm">{profileFormErrors.bio}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {profileFormErrors.dateOfBirth && (
              <p className="text-red-500 text-sm">{profileFormErrors.dateOfBirth}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {profileFormErrors.website && (
              <p className="text-red-500 text-sm">{profileFormErrors.website}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {contactFormErrors.email && (
              <p className="text-red-500 text-sm">{contactFormErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Country Code</label>
            <input
              type="text"
              name="countryCode"
              value={formData.countryCode}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {contactFormErrors.countryCode && (
              <p className="text-red-500 text-sm">{contactFormErrors.countryCode}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {contactFormErrors.phoneNumber && (
              <p className="text-red-500 text-sm">{contactFormErrors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {contactFormErrors.address && (
              <p className="text-red-500 text-sm">{contactFormErrors.address}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;