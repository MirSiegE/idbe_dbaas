import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../../assets/logo.png'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="w-40 bg-white border-r border-gray-100 flex flex-col py-3 flex-shrink-0 min-h-screen">

      {/* Logo */}
      <div className="flex items-center gap-2 px-3 pb-3 border-b border-gray-100 mb-2">
        <img src={logo} alt="InteliDB Logo" className="w-7 h-7 rounded-full" />
        <div>
          <p className="text-xs font-medium text-gray-800">InteliDB</p>
          <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">
            Enterprise
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex flex-col">
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-2 px-3 py-2 text-xs ${
            location.pathname === '/dashboard'
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          📊 Dashboard
        </button>

        <button
          onClick={() => navigate('/projects')}
          className={`flex items-center gap-2 px-3 py-2 text-xs ${
            location.pathname === '/projects'
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          📁 Projects
        </button>
      </div>

      {/* Logout */}
      <div className="mt-auto border-t border-gray-100 pt-2 px-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs text-red-500 hover:text-red-600 py-2"
        >
          🚪 Logout
        </button>
      </div>

    </div>
  )
}

export default Sidebar