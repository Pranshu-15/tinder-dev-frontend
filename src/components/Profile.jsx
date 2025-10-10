import React from 'react'
import ProfileUpdateForm from './ProfileUpdateForm'
import { useSelector } from 'react-redux'

const Profile = () => {
  const user = useSelector((store) => store.user)
  return (
    <>
    {user && ( <ProfileUpdateForm user = {user}/> )}
    </>
  )
}

export default Profile
