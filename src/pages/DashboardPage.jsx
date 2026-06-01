import { useState } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'
import BillingCards from '../components/dashboard/BillingCards'
import TelemetryCards from '../components/dashboard/TelemetryCards'
import Recommendations from '../components/dashboard/Recommendations'

function DashboardPage() {
  const [showModal, setShowModal] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')

  const handleCreate = () => {
    if (projectName.trim() === '') return
    alert(`Project "${projectName}" created!`)
    setProjectName('')
    setDescription('')
    setShowModal(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">

        <TopBar
          title="Dashboard"
          subtitle="Overview of your billing, telemetry and recommendations"
        />

        <div className="p-6 flex flex-col gap-6">

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-gray-900">
                Welcome back, Vaishnavi
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Here is what is happening across your projects
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New project
            </button>
          </div>

          {/* Billing Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">
                Billing overview
              </h2>
              <span className="text-xs text-gray-400">Current billing period</span>
            </div>
            <BillingCards />
          </div>

          {/* Telemetry Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">
                Platform telemetry
              </h2>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                Live
              </span>
            </div>
            <TelemetryCards />
          </div>

          {/* Recommendations Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">
                Recommendations
              </h2>
              <button className="text-xs text-blue-600 hover:underline">
                View all
              </button>
            </div>
            <Recommendations />
          </div>

        </div>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-gray-100 p-6 w-96 shadow-xl">

            {/* Modal Header */}
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-gray-900">
                Create a new project
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Provision a dedicated PostgreSQL schema workspace
              </p>
            </div>

            {/* Project Name */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600 block mb-1.5">
                Project name
              </label>
              <input
                type="text"
                placeholder="e.g. student_portal"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-300"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Use lowercase letters, numbers and underscores only
              </p>
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="text-xs font-medium text-gray-600 block mb-1.5">
                Description
                <span className="text-gray-300 font-normal ml-1">— optional</span>
              </label>
              <textarea
                placeholder="Brief description of this project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none placeholder-gray-300"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-4"></div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Create project
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default DashboardPage