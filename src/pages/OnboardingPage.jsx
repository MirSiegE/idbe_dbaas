import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'

function OnboardingPage() {
  const [projectName, setProjectName] = useState('')
  const navigate = useNavigate()

  const handleCreate = () => {
    if (projectName.trim() === '') return
    alert(`Project "${projectName}" created!`)
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar
          title="Welcome, Vaishnavi!"
          subtitle="Let's get started"
        />

        {/* Centered Card */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 w-full max-w-sm text-center">

            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🗄️</span>
            </div>

            {/* Title */}
            <h2 className="text-sm font-medium text-gray-800 mb-2">
              Create your first project
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Provision a PostgreSQL schema workspace in seconds
            </p>

            {/* Input */}
            <input
              type="text"
              placeholder="Project name (e.g. student_portal)"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />

            {/* Button */}
            <button
              onClick={handleCreate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2.5 rounded-lg transition-colors"
            >
              Create database
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}

export default OnboardingPage