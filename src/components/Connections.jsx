import axios from "axios"
import React, { useEffect } from "react"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addConnection } from "../utils/connectionSlice"

const Connections = () => {
  const connections = useSelector((store) => store.connections)
  const dispatch = useDispatch()

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true })
      dispatch(addConnection(res?.data?.data))
    } catch (_err) {
    }
  }

  useEffect(() => { fetchConnections() }, [])

  if (!connections) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-pink-500 animate-spin" />
    </div>
  )

  if (connections.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center text-4xl mb-5 border border-white/5">
        🔗
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">No connections yet</h2>
      <p className="text-white/35 text-sm max-w-xs">
        Start swiping to build your developer network. Mutual interests become connections.
      </p>
    </div>
  )

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Connections</h1>
          <p className="text-white/35 text-sm mt-1">
            {connections.length} developer{connections.length !== 1 ? 's' : ''} in your network
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((connection) => {
            const { _id, firstName, lastName, age, gender, about, photoURL, skills } = connection
            return (
              <div
                key={_id}
                className="group rounded-2xl overflow-hidden border border-white/7 bg-white/3 hover:border-pink-500/25 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/8"
              >
                {/* Photo strip */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={photoURL}
                    alt={`${firstName} ${lastName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-transparent to-transparent" />
                  {gender && (
                    <span className="absolute bottom-3 left-4 text-pink-400 text-xs capitalize font-medium">
                      {gender}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm">{firstName} {lastName}</h3>
                    {age && <span className="text-white/35 text-xs">{age}</span>}
                  </div>

                  {about && (
                    <p className="text-white/45 text-xs leading-relaxed line-clamp-2 mb-3">{about}</p>
                  )}

                  {skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/15">
                          {skill}
                        </span>
                      ))}
                      {skills.length > 3 && (
                        <span className="text-[10px] text-white/25 px-1">+{skills.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Connections
