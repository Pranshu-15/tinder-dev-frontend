import React from 'react'

const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full bg-black/30 backdrop-blur-xl border-t border-white/5 py-2.5 text-center z-40">
      <p className="text-xs text-white/20">
        © {new Date().getFullYear()} devTinder — Where code meets chemistry
      </p>
    </footer>
  )
}

export default Footer
