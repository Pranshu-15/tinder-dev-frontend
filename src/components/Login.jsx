import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'

const TECH_TAGS = ['React', 'Node.js', 'Python', 'Go', 'Rust', 'TypeScript', 'Docker', 'AWS']

const Login = () => {
  const [emailId, setEmailId] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await axios.post(BASE_URL + "/login", { emailId, password }, { withCredentials: true })
      dispatch(addUser(res?.data?.data))
      navigate("/")
    } catch (err) {
      setError(err?.response?.data || "Login failed. Check your credentials.")
    }
  }

  const handleSignUp = async () => {
    try {
      const res = await axios.post(BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      )
      dispatch(addUser(res?.data?.data))
      navigate("/profile")
    } catch (err) {
      setError(err?.response?.data || "Sign up failed. Please try again.")
    }
  }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-pink-500/60 focus:bg-white/8 transition-all"

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-white/8">
        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-between w-5/12 p-10 bg-gradient-to-br from-pink-600 via-rose-500 to-orange-500">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💻</span>
            <span className="text-xl font-bold text-white tracking-tight">devTinder</span>
          </div>

          <div>
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-3xl font-bold text-white leading-snug mb-3">
              Find your perfect<br />dev match
            </h2>
            <p className="text-white/65 text-sm leading-relaxed">
              Connect with developers who share your stack, passion, and coding style. Swipe right on talent.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {TECH_TAGS.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-white/30 text-xs">Where code meets chemistry ✨</p>
        </div>

        {/* Right panel - form */}
        <div className="flex-1 bg-[#0c0c1a] p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-7">
            <h3 className="text-2xl font-bold text-white">
              {isSignUp ? 'Create account' : 'Welcome back'}
            </h3>
            <p className="text-white/35 text-sm mt-1">
              {isSignUp ? 'Join the dev community today' : 'Sign in to your account'}
            </p>
          </div>

          <div className="space-y-4">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">First Name</label>
                  <input
                    type="text" value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="John" className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Last Name</label>
                  <input
                    type="text" value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Doe" className={inputCls}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Email</label>
              <input
                type="email" value={emailId}
                onChange={e => setEmailId(e.target.value)}
                placeholder="john@dev.io" className={inputCls}
              />
            </div>

            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Password</label>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" className={inputCls}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={isSignUp ? handleSignUp : handleLogin}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 transition-all hover:shadow-lg hover:shadow-pink-500/20 active:scale-[0.98] mt-2"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-white/35 pt-1">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => { setIsSignUp(v => !v); setError('') }}
                className="ml-1.5 text-pink-400 hover:text-pink-300 font-medium transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
