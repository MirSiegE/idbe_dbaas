import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../../assets/logo.png'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showLogout, setShowLogout] = useState(false)

  return (
    <>
      <div className="w-52 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 min-h-screen">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
          <img src={logo} alt="InteliDB Logo" className="w-7 h-7 rounded-full" />
          <div>
            <p className="text-sm font-semibold text-gray-900 tracking-tight">InteliDB</p>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">
              Enterprise
            </span>
          </div>
        </div>

        {/* Nav Section */}
        <div className="flex flex-col gap-0.5 px-2 pt-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-1">
            Main
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === '/dashboard'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>

          <button
            onClick={() => navigate('/projects')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === '/projects' || location.pathname.startsWith('/projects/')
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
            Projects
          </button>
        </div>

        {/* Logout */}
        <div className="mt-auto px-2 pb-4 border-t border-gray-100 pt-3">
          <button
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

      </div>

      {/* Logout Confirmation Modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-gray-100 p-6 w-80 shadow-xl">

            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>

            <h2 className="text-sm font-semibold text-gray-900 mb-1">
              Sign out of InteliDB?
            </h2>
            <p className="text-xs text-gray-400 mb-5 leading-relaxed">
              You will be redirected to the login page. Any unsaved changes will be lost.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-2 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
              >
                Sign out
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar