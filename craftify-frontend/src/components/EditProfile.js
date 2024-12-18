import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function EditProfile() {
  const { id } = useParams();  
  const navigate = useNavigate();
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messages, setMessages] = useState([]);
  const [profileFormErrors, setProfileFormErrors] = useState({});
  const [contactFormErrors, setContactFormErrors] = useState({});

  useEffect(() => {
    api.get(`user/${id}/`)
      .then(response => {
        const user = response.data;
        setBio(user.bio || '');
        setDateOfBirth(user.date_of_birth || '');
        setWebsite(user.website || '');
        setEmail(user.email || '');
        setCountryCode(user.country_code || '');
        setAddress(user.address || '');
        setPhoneNumber(user.phone_number || '');
      })
      .catch(() => {
        setMessages(['Error fetching user data.']);
      });
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();
    setMessages([]);
    setProfileFormErrors({});
    setContactFormErrors({});

    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('date_of_birth', dateOfBirth);
    formData.append('website', website);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }
    formData.append('email', email);
    formData.append('country_code', countryCode);
    formData.append('address', address);
    formData.append('phone_number', phoneNumber);

    api.put(`user/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => {
        setMessages(['Profile updated successfully.']);
        // navigate(`/profile/${id}`);
      })
      .catch(error => {
        if (error.response && error.response.data) {
          const data = error.response.data;
          setMessages(['There was an error updating your profile.']);
          if (data.profile_errors) setProfileFormErrors(data.profile_errors);
          if (data.contact_errors) setContactFormErrors(data.contact_errors);
        } else {
          setMessages(['An unexpected error occurred.']);
        }
      });
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Edit Your Profile</h1>

      {messages.length > 0 && (
        <ul className="mb-4">
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      )}

      <form
        method="post"
        encType="multipart/form-data"
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold">Profile Information</h2>
        {/* Non-field errors for profile_form */}
        {Object.keys(profileFormErrors).length > 0 && profileFormErrors.non_field_errors && (
          <div className="text-red-500">
            {profileFormErrors.non_field_errors.map((error, i) => <p key={i}>{error}</p>)}
          </div>
        )}

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Bio</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
          {profileFormErrors.bio && profileFormErrors.bio.map((err, i) => (
            <p key={i} className="text-red-500">{err}</p>
          ))}
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={dateOfBirth}
            onChange={e => setDateOfBirth(e.target.value)}
          />
          {profileFormErrors.date_of_birth && profileFormErrors.date_of_birth.map((err, i) => (
            <p key={i} className="text-red-500">{err}</p>
          ))}
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Profile Picture</label>
          <input
            type="file"
            onChange={e => setProfilePicture(e.target.files[0])}
          />
          {profileFormErrors.profile_picture && profileFormErrors.profile_picture.map((err, i) => (
            <p key={i} className="text-red-500">{err}</p>
          ))}
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Website</label>
          <input
            type="url"
            className="w-full border rounded px-3 py-2"
            value={website}
            onChange={e => setWebsite(e.target.value)}
          />
          {profileFormErrors.website && profileFormErrors.website.map((err, i) => (
            <p key={i} className="text-red-500">{err}</p>
          ))}
        </div>

        <h2 className="text-xl font-bold mt-6">Contact Information</h2>
        {/* Non-field errors for contact_form */}
        {Object.keys(contactFormErrors).length > 0 && contactFormErrors.non_field_errors && (
          <div className="text-red-500">
            {contactFormErrors.non_field_errors.map((error, i) => <p key={i}>{error}</p>)}
          </div>
        )}

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          {contactFormErrors.email && contactFormErrors.email.map((err, i) => (
            <p key={i} className="text-red-500">{err}</p>
          ))}
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Country Code</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={countryCode}
            onChange={e => setCountryCode(e.target.value)}
          />
          {contactFormErrors.country_code && contactFormErrors.country_code.map((err, i) => (
            <p key={i} className="text-red-500">{err}</p>
          ))}
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Address</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
          {contactFormErrors.address && contactFormErrors.address.map((err, i) => (
            <p key={i} className="text-red-500">{err}</p>
          ))}
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
          />
          {contactFormErrors.phone_number && contactFormErrors.phone_number.map((err, i) => (
            <p key={i} className="text-red-500">{err}</p>
          ))}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;