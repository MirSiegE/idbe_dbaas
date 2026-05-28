import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ProjectCard({ project }) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showManage, setShowManage] = useState(false)
  const [projectName, setProjectName] = useState(project.name)
  const [description, setDescription] = useState('')

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-xl p-3 mb-2">

        {/* Top Row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-gray-800">{project.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">Schema: {project.schema}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              Active
            </span>

            {/* Three Dot Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-gray-600 text-lg px-1"
              >
                ⋯
              </button>

              {/* Dropdown */}
              {showMenu && (
                <div className="absolute right-0 top-6 bg-white border border-gray-100 rounded-xl shadow-md w-40 z-10">
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      setShowManage(true)
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 rounded-t-xl"
                  >
                    ⚙️ Manage project
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      setShowDelete(true)
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-b-xl"
                  >
                    🗑️ Delete project
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/projects/${project.id}/telemetry`)}
            className="flex items-center gap-1 text-[10px] px-2 py-1 border border-gray-100 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100"
          >
            📊 Telemetry
          </button>
          <button
            onClick={() => navigate(`/projects/${project.id}/billing`)}
            className="flex items-center gap-1 text-[10px] px-2 py-1 border border-gray-100 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100"
          >
            💰 Billing
          </button>
          <button
            onClick={() => navigate(`/projects/${project.id}/credentials`)}
            className="flex items-center gap-1 text-[10px] px-2 py-1 border border-gray-100 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100"
          >
            🔑 Credentials
          </button>
        </div>

      </div>

      {/* Manage Project Modal */}
      {showManage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-lg">

            <h2 className="text-sm font-medium text-gray-800 mb-1">
              Manage project
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Update your project details
            </p>

            {/* Project Name */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 block mb-1">
                Project name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Schema — read only */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 block mb-1">
                Schema (read only)
              </label>
              <input
                type="text"
                value={project.schema}
                disabled
                className="w-full border border-gray-100 rounded-lg px-3 py-2 text-xs bg-gray-50 text-gray-400"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 block mb-1">
                Description
              </label>
              <textarea
                placeholder="Project description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 h-16 resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowManage(false)}
                className="flex-1 py-2 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Project "${projectName}" updated!`)
                  setShowManage(false)
                }}
                className="flex-1 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Save changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-72 shadow-lg text-center">

            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <span className="text-lg">🗑️</span>
            </div>

            <h2 className="text-sm font-medium text-gray-800 mb-2">
              Delete project?
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              This will permanently delete{' '}
              <span className="font-medium text-gray-600">{project.name}</span>{' '}
              and its schema{' '}
              <span className="font-medium text-gray-600">{project.schema}</span>.
              This action cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 py-2 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Project "${project.name}" deleted!`)
                  setShowDelete(false)
                }}
                className="flex-1 py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

export default ProjectCard