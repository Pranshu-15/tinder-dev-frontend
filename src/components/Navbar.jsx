import React from 'react'
import { useSelector } from 'react-redux'

const Navbar = () => {
  const user = useSelector((store) => store.user)
  return (
    <>
     <div className="navbar bg-base-300 shadow-sm">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">👨‍💻devTinder￣\_(ツ)_/￣</a>
  </div>
  {user &&(<div className="flex gap-2  items-center">
        <p className='px-2'>Hello {user.firstName}</p>
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src={user.photoURL} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>)}
</div> 
    </>
  )
}

export default Navbar
