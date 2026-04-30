import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice'
import UserCard from './UserCard'

const Feed = () => {
  const feed = useSelector((store) => store.feed)
  const dispatch = useDispatch()

  const getFeed = async () => {
    if (feed && feed.length > 0) return
    try {
      const res = await axios.get(BASE_URL + "/user/feed", { withCredentials: true })
      dispatch(addFeed(res.data))
    } catch (_err) {
    }
  }

  useEffect(() => { getFeed() }, [])

  if (!feed) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-pink-500 animate-spin" />
    </div>
  )

  if (feed.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-orange-500/20 flex items-center justify-center text-4xl mb-5 border border-white/5">
        🎉
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">You've seen everyone!</h2>
      <p className="text-white/35 text-sm max-w-xs">
        You've gone through all available developers. Check back later for new matches.
      </p>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-16 pb-12">
      {/* Ambient glow behind card */}
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-3xl bg-pink-500/10 scale-110 rounded-full -z-10" />

        {/* Stack shadow cards */}
        <div className="absolute inset-0 translate-y-5 scale-[0.93] rounded-3xl bg-white/3 -z-10" />
        <div className="absolute inset-0 translate-y-2.5 scale-[0.96] rounded-3xl bg-white/5 -z-10" />

        <UserCard key={feed[0]._id} user={feed[0]} />
      </div>

      <p className="text-white/20 text-xs mt-2">
        {feed.length} developer{feed.length !== 1 ? 's' : ''} nearby
      </p>
    </div>
  )
}

export default Feed
