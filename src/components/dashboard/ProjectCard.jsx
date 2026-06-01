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
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">

        {/* Top Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6M9 15h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{project.name}</p>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">{project.schema}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
              Active
            </span>

            {/* Three Dot Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>

              {/* Dropdown */}
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg w-44 z-10 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      setShowManage(true)
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage project
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      setShowDelete(true)
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-3"></div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/projects/${project.id}/telemetry`)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Telemetry
          </button>
          <button
            onClick={() => navigate(`/projects/${project.id}/billing`)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Billing
          </button>
          <button
            onClick={() => navigate(`/projects/${project.id}/credentials`)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Credentials
          </button>
        </div>

      </div>

      {/* Manage Project Modal */}
      {showManage && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-gray-100 p-6 w-96 shadow-xl">

            <div className="mb-5">
              <h2 className="text-sm font-semibold text-gray-900">
                Manage project
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Update your project details
              </p>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600 block mb-1.5">
                Project name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600 block mb-1.5">
                Schema
                <span className="text-gray-300 font-normal ml-1">— read only</span>
              </label>
              <input
                type="text"
                value={project.schema}
                disabled
                className="w-full border border-gray-100 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-400 font-mono"
              />
            </div>

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

            <div className="border-t border-gray-100 mb-4"></div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowManage(false)}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Project "${projectName}" updated!`)
                  setShowManage(false)
                }}
                className="flex-1 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Save changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-gray-100 p-6 w-80 shadow-xl">

            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h2 className="text-sm font-semibold text-gray-900 text-center mb-2">
              Delete project?
            </h2>
            <p className="text-xs text-gray-400 text-center mb-5 leading-relaxed">
              This will permanently delete{' '}
              <span className="font-semibold text-gray-700">{project.name}</span>{' '}
              and its schema{' '}
              <span className="font-mono text-gray-600">{project.schema}</span>.
              This action cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Project "${project.name}" deleted!`)
                  setShowDelete(false)
                }}
                className="flex-1 py-2.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
              >
                Delete project
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

export default ProjectCard