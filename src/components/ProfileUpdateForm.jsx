import React, { useState } from 'react';
import UserCard from './UserCard';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const ProfileUpdateForm = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoURL, setPhotoURL] = useState(user.photoURL);
  const [gender, setGender] = useState(user.gender);
  const [age, setAge] = useState(user.age);
  const [about, setAbout] = useState(user.about);
  const [skills, setSkills] = useState(user.skills?.join(', ') || '');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSaveProfile = async () => {
    setError('');
    try {
      const res = await axios.patch(
        BASE_URL + '/profile/update',
        { firstName, lastName, photoURL, gender, age, about,  skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill) },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      toast.success('Profile updated successfully! 🎉', {
        position: 'top-center',
        autoClose: 5000,
        theme: 'dark',
        transition: Bounce,
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Something went wrong. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 5000,
        theme: 'dark',
        transition: Bounce,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center pt-10 mb-6 text-white">
        Update Profile
      </h2>

      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 p-4 w-full max-w-6xl mx-auto">

        {/* Form Section */}
        <div className="w-full lg:w-1/2 bg-base-200 rounded-lg shadow-lg p-6">
          <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full bg-base-100 text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full bg-base-100 text-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Photo URL</label>
              <input type="url" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)}
                className="input input-bordered w-full bg-base-100 text-white" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}
                  className="select select-bordered w-full bg-base-100 text-white">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
                  className="input input-bordered w-full bg-base-100 text-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">About</label>
              <textarea value={about} onChange={(e) => setAbout(e.target.value)}
                className="textarea textarea-bordered w-full bg-base-100 text-white resize-none"
                rows="4" placeholder="Tell us about yourself..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Skills</label>
              <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)}
                className="input input-bordered w-full bg-base-100 text-white" placeholder="e.g. JavaScript, React" />
              <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
            </div>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button onClick={handleSaveProfile}
              className="btn btn-primary w-full text-white">Save Profile</button>
          </div>
        </div>

        <UserCard user = {{firstName,
      lastName,
      photoURL,
      gender,
      age,
      about,
      skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill)}} />

      </div>
    </>
  );
};

export default ProfileUpdateForm;
