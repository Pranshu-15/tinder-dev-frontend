import React, { useRef, useState } from 'react'
import UserCard from './UserCard'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const SKILL_COLORS = [
  'from-violet-500/25 to-purple-500/25 border-violet-400/30 text-violet-300',
  'from-pink-500/25 to-rose-500/25 border-pink-400/30 text-pink-300',
  'from-blue-500/25 to-cyan-500/25 border-blue-400/30 text-blue-300',
  'from-orange-500/25 to-amber-500/25 border-orange-400/30 text-orange-300',
  'from-emerald-500/25 to-teal-500/25 border-emerald-400/30 text-emerald-300',
]

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-sm flex-shrink-0">
      {icon}
    </div>
    <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">{title}</span>
    <div className="flex-1 h-px bg-gradient-to-r from-white/8 to-transparent" />
  </div>
)

const ProfileUpdateForm = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [photoURL, setPhotoURL] = useState(user.photoURL)
  const [gender, setGender] = useState(user.gender)
  const [age, setAge] = useState(user.age)
  const [about, setAbout] = useState(user.about)
  const [skillsArr, setSkillsArr] = useState(user.skills || [])
  const [skillInput, setSkillInput] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoURL(URL.createObjectURL(file))
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('photo', file)
      const res = await axios.post(BASE_URL + '/profile/upload-photo', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setPhotoURL(res.data.photoURL)
      dispatch(addUser({ ...user, photoURL: res.data.photoURL }))
      toast.success('Photo updated!', { position: 'top-center', autoClose: 2000, theme: 'dark', transition: Bounce })
    } catch (_err) {
      setPhotoURL(user.photoURL)
      toast.error('Photo upload failed. Try again.', { position: 'top-center', autoClose: 3000, theme: 'dark', transition: Bounce })
    } finally {
      setUploading(false)
    }
  }

  const handleSkillKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault()
      const newSkill = skillInput.replace(/,/g, '').trim()
      if (newSkill && !skillsArr.includes(newSkill)) {
        setSkillsArr(prev => [...prev, newSkill])
      }
      setSkillInput('')
    } else if (e.key === 'Backspace' && !skillInput && skillsArr.length) {
      setSkillsArr(prev => prev.slice(0, -1))
    }
  }

  const removeSkill = (i) => setSkillsArr(prev => prev.filter((_, idx) => idx !== i))

  const handleSaveProfile = async () => {
    setError('')
    try {
      const res = await axios.patch(
        BASE_URL + '/profile/update',
        { firstName, lastName, gender, age, about, skills: skillsArr },
        { withCredentials: true }
      )
      dispatch(addUser(res?.data?.data))
      toast.success('Profile updated!', { position: 'top-center', autoClose: 1500, theme: 'dark', transition: Bounce })
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong'
      setError(msg)
      toast.error(msg, { position: 'top-center', autoClose: 4000, theme: 'dark', transition: Bounce })
    }
  }

  const previewUser = { firstName, lastName, photoURL, gender, age, about, skills: skillsArr }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/10 transition-all"

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen pt-20 pb-16 px-4 bg-[#080810] relative overflow-hidden">

        {/* Ambient background glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -left-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute top-40 -right-32 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative">

          {/* Page header */}
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-bold">
              <span className="text-white">Edit </span>
              <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">Profile</span>
            </h1>
            <p className="text-white/35 text-sm mt-2">Craft how the dev world sees you ✨</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── Form card ── */}
            <div className="flex-1 p-px rounded-2xl bg-gradient-to-br from-pink-500/15 via-white/3 to-violet-500/15">
              <div className="rounded-2xl bg-[#0d0d16] p-6 lg:p-8 space-y-8">

                {/* ── Photo upload ── */}
                <div className="flex flex-col items-center gap-3">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  <div className="relative group cursor-pointer" onClick={() => !uploading && fileInputRef.current?.click()}>

                    {/* Gradient ring */}
                    <div className="w-36 h-36 rounded-full p-[3px] bg-gradient-to-br from-pink-500 via-orange-400 to-violet-500 shadow-lg shadow-pink-500/20">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#080810]">
                        {photoURL
                          ? <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
                        }
                      </div>
                    </div>

                    {/* Camera overlay */}
                    <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                      {uploading
                        ? <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-white animate-spin" />
                        : <>
                            <span className="text-xl">📷</span>
                            <span className="text-white text-[10px] font-medium">Change</span>
                          </>
                      }
                    </div>

                    {/* Edit badge */}
                    <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-xs shadow-lg border-2 border-[#0d0d16]">
                      ✏️
                    </div>
                  </div>
                  <p className="text-white/25 text-[10px]">JPG, PNG · max 5MB</p>
                </div>

                {/* ── Identity ── */}
                <div>
                  <SectionHeader icon="👤" title="Identity" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 mb-1.5 block">First Name</label>
                      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                        placeholder="John" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 mb-1.5 block">Last Name</label>
                      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                        placeholder="Doe" className={inputCls} />
                    </div>
                  </div>
                </div>

                {/* ── Details ── */}
                <div>
                  <SectionHeader icon="📋" title="Details" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 mb-1.5 block">Age</label>
                      <input type="number" value={age} onChange={e => setAge(e.target.value)}
                        placeholder="25" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 mb-1.5 block">Gender</label>
                      <select value={gender} onChange={e => setGender(e.target.value)}
                        className={inputCls + " cursor-pointer"}>
                        <option value="" className="bg-[#0d0d1a]">Select gender</option>
                        <option value="male" className="bg-[#0d0d1a]">Male</option>
                        <option value="female" className="bg-[#0d0d1a]">Female</option>
                        <option value="others" className="bg-[#0d0d1a]">Others</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ── About ── */}
                <div>
                  <SectionHeader icon="📝" title="About Me" />
                  <textarea
                    value={about}
                    onChange={e => setAbout(e.target.value)}
                    placeholder="Tell the dev community about yourself — your passions, what you're building, what you're looking for..."
                    rows={4}
                    className={inputCls + " resize-none leading-relaxed"}
                  />
                  <p className="text-right text-[10px] text-white/20 mt-1">{about?.length || 0} / 500</p>
                </div>

                {/* ── Skills ── */}
                <div>
                  <SectionHeader icon="🛠️" title="Skills" />
                  <div className="min-h-[52px] w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 flex flex-wrap gap-2 items-center focus-within:border-pink-500/50 focus-within:ring-2 focus-within:ring-pink-500/10 transition-all cursor-text"
                    onClick={() => document.getElementById('skill-input')?.focus()}>
                    {skillsArr.map((skill, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r border ${SKILL_COLORS[i % SKILL_COLORS.length]}`}
                      >
                        {skill}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeSkill(i) }}
                          className="opacity-50 hover:opacity-100 transition-opacity leading-none"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <input
                      id="skill-input"
                      type="text"
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder={skillsArr.length === 0 ? 'Type a skill and press Enter...' : 'Add more...'}
                      className="flex-1 min-w-[120px] bg-transparent text-white text-sm placeholder-white/20 focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-white/20 mt-1.5">Press Enter or comma to add · Backspace to remove last</p>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Save button */}
                <button
                  onClick={handleSaveProfile}
                  className="relative w-full py-3.5 rounded-xl font-semibold text-white overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-400 transition-all group-hover:from-pink-600 group-hover:to-orange-500" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 70%)' }} />
                  <span className="relative flex items-center justify-center gap-2">
                    <span>Save Profile</span>
                    <span className="text-base">→</span>
                  </span>
                </button>

              </div>
            </div>

            {/* ── Live preview ── */}
            <div className="flex flex-col items-center gap-3 lg:sticky lg:top-20">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Live Preview</p>
              </div>
              <UserCard user={previewUser} />
              <p className="text-[10px] text-white/20 text-center max-w-[200px]">
                This is exactly how other developers will see your card
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileUpdateForm
