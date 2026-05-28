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

      <div className="flex flex-col flex-1">

        <TopBar
          title="Welcome back, Vaishnavi!"
          subtitle="Here is your overview"
        />

        <div className="p-4 flex flex-col gap-3">

          {/* Create Project Button */}
          <button
            onClick={() => setShowModal(true)}
            className="self-start flex items-center gap-2 text-xs px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Create project
          </button>

          <BillingCards />
          <TelemetryCards />
          <Recommendations />

        </div>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-lg">
            <h2 className="text-sm font-medium text-gray-800 mb-1">
              Create new project
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Provision a PostgreSQL schema workspace
            </p>
            <div className="mb-3">
              <label className="text-xs text-gray-500 block mb-1">Project name</label>
              <input
                type="text"
                placeholder="e.g. student_portal"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="text-xs text-gray-500 block mb-1">Description (optional)</label>
              <textarea
                placeholder="Brief description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 h-16 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
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