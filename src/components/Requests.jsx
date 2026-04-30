import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests, removeRequest } from '../utils/requestSlice'

const Requests = () => {
  const requests = useSelector((store) => store.requests)
  const dispatch = useDispatch()

  const reviewRequest = async (status, id) => {
    try {
      await axios.post(BASE_URL + "/request/review/" + status + "/" + id, {}, { withCredentials: true })
      dispatch(removeRequest(id))
    } catch (_err) {
    }
  }

  const fetchRequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/recived", { withCredentials: true })
      dispatch(addRequests(res?.data?.data))
    } catch (_err) {
    }
  }

  useEffect(() => { fetchRequest() }, [])

  if (!requests) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-pink-500 animate-spin" />
    </div>
  )

  if (requests.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-orange-500/20 flex items-center justify-center text-4xl mb-5 border border-white/5">
        📬
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">No pending requests</h2>
      <p className="text-white/35 text-sm max-w-xs">
        When developers show interest in you, their requests will appear here.
      </p>
    </div>
  )

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Requests</h1>
          <p className="text-white/35 text-sm mt-1">
            {requests.length} pending {requests.length === 1 ? 'request' : 'requests'}
          </p>
        </div>

        <div className="space-y-3">
          {requests.map((request) => {
            const { _id, firstName, lastName, photoURL, gender, age, about, skills } = request?.fromUserId
            return (
              <div
                key={_id}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/7 bg-white/3 hover:border-white/12 hover:bg-white/5 transition-all"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={photoURL}
                    alt={`${firstName} ${lastName}`}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="absolute inset-0 rounded-full ring-2 ring-pink-500/30" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-semibold text-sm">{firstName} {lastName}</p>
                    {age && <span className="text-white/35 text-xs">{age}</span>}
                  </div>
                  {gender && <p className="text-pink-400 text-xs capitalize mb-1">{gender}</p>}
                  {about && <p className="text-white/35 text-xs truncate">{about}</p>}
                  {skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => reviewRequest("rejected", request._id)}
                    title="Reject"
                    className="w-10 h-10 rounded-full border border-white/10 bg-white/4 flex items-center justify-center text-white/45 hover:text-red-400 hover:border-red-400/30 hover:bg-red-500/10 transition-all text-sm"
                  >
                    ✕
                  </button>
                  <button
                    onClick={() => reviewRequest("accepted", request._id)}
                    title="Accept"
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white hover:shadow-lg hover:shadow-pink-500/30 hover:scale-105 transition-all text-sm"
                  >
                    ✓
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Requests
