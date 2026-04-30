import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
import { removeUser } from '../utils/userSlice'

const Navbar = () => {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await axios.post(BASE_URL + "/logout", {}, { withCredentials: true })
    dispatch(removeUser())
    navigate("/login")
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">💻</span>
          <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
            devTinder
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/50 hidden sm:block">
              Hey, <span className="text-white font-medium">{user.firstName}</span>
            </span>

            <div className="relative">
              <button
                onClick={() => setOpen(v => !v)}
                className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-pink-500/40 hover:ring-pink-500/80 transition-all"
              >
                <img src={user.photoURL} alt={user.firstName} className="w-full h-full object-cover" />
              </button>

              {open && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                  <ul className="absolute right-0 top-12 z-20 w-52 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10 bg-[#0d0d1a]/95 backdrop-blur-xl p-1.5 space-y-0.5">
                    {[
                      { to: '/profile', label: '👤  Profile' },
                      { to: '/connections', label: '🔗  Connections' },
                      { to: '/requests', label: '📬  Requests' },
                    ].map(({ to, label }) => (
                      <li key={to}>
                        <Link
                          to={to}
                          onClick={() => setOpen(false)}
                          className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/8 rounded-xl transition-all"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                    <li className="border-t border-white/5 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        🚪  Logout
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
