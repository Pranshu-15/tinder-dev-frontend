import axios from 'axios'
import React, { useState } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch } from 'react-redux'
import { removeUserFromFeed } from '../utils/feedSlice'

const UserCard = ({ user }) => {
  const dispatch = useDispatch()
  const { _id, firstName, lastName, gender, photoURL, about, age, skills } = user
  const [swipeDir, setSwipeDir] = useState(null)

  const handleSendRequest = async (status, userId) => {
    if (!userId || swipeDir) return
    const dir = status === 'intrested' ? 'right' : 'left'
    setSwipeDir(dir)
    setTimeout(async () => {
      try {
        await axios.post(BASE_URL + "/request/send/" + status + "/" + userId, {}, { withCredentials: true })
        dispatch(removeUserFromFeed(userId))
      } catch (_err) {
        setSwipeDir(null)
      }
    }, 500)
  }

  const cardStyle = {
    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.45s ease',
    transform: swipeDir === 'right'
      ? 'translateX(160%) rotate(25deg)'
      : swipeDir === 'left'
      ? 'translateX(-160%) rotate(-25deg)'
      : 'translateX(0) rotate(0deg)',
    opacity: swipeDir ? 0 : 1,
  }

  return (
    <div
      style={cardStyle}
      className="relative w-[340px] h-[580px] rounded-3xl overflow-hidden shadow-2xl shadow-black/70 select-none group"
    >
      {/* Photo */}
      <img
        src={photoURL}
        alt={`${firstName} ${lastName}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* LIKE stamp */}
      {swipeDir === 'right' && (
        <div
          className="absolute top-10 left-5 z-20 border-4 border-emerald-400 text-emerald-400 font-black text-3xl px-3 py-1 rounded-xl tracking-widest"
          style={{ transform: 'rotate(-22deg)', textShadow: '0 0 20px rgba(52,211,153,0.6)' }}
        >
          LIKE
        </div>
      )}

      {/* NOPE stamp */}
      {swipeDir === 'left' && (
        <div
          className="absolute top-10 right-5 z-20 border-4 border-red-400 text-red-400 font-black text-3xl px-3 py-1 rounded-xl tracking-widest"
          style={{ transform: 'rotate(22deg)', textShadow: '0 0 20px rgba(248,113,113,0.6)' }}
        >
          NOPE
        </div>
      )}

      {/* Top badge */}
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 text-xs">
          💻 dev
        </span>
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-20">
        <div className="flex items-end gap-2 mb-0.5">
          <h2 className="text-2xl font-bold text-white leading-tight">
            {firstName} {lastName}
          </h2>
          {age && <span className="text-white/60 text-base mb-0.5">{age}</span>}
        </div>

        {gender && (
          <p className="text-pink-400 text-xs capitalize font-medium mb-2">{gender}</p>
        )}

        {about && (
          <p className="text-white/55 text-sm leading-relaxed line-clamp-2 mb-3">{about}</p>
        )}

        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/75 border border-white/10"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/8 text-white/40">
                +{skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-5">
        <button
          onClick={() => handleSendRequest("ignored", _id)}
          title="Pass"
          disabled={!!swipeDir}
          className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 text-xl hover:bg-red-500/70 hover:border-red-400/50 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-lg disabled:pointer-events-none"
        >
          ✕
        </button>
        <button
          onClick={() => handleSendRequest("intrested", _id)}
          title="Interested"
          disabled={!!swipeDir}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white text-xl hover:scale-110 hover:shadow-xl hover:shadow-pink-500/40 active:scale-95 transition-all shadow-lg disabled:pointer-events-none"
        >
          ♥
        </button>
      </div>
    </div>
  )
}

export default UserCard
