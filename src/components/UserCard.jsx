import React from 'react'

const UserCard = ({user}) => {
  console.log(user)
  const {firstName,gender,lastName,photoURL,about} = user
  return (
    <>
     <div className="card bg-base-300 w-96 shadow-sm">
  <figure>
    <img
      src={photoURL}
      alt="profile pic" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{firstName + " " + lastName}</h2>
    {about && <p>{about}</p>}
    <h3>{gender}</h3>
    <div className="card-actions justify-center">
      <button className="btn btn-primary">Skip</button>
      <button className="btn btn-secondary">Intrested</button>
    </div>
  </div>
</div> 
    </>
  )
}

export default UserCard
