import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'
import { getDemoCredentials } from '../data/demoCredentials'
import { existingDemoProjects, getProjectById } from '../data/demoProjects'

function ProjectCredentialsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = getDemoCredentials(getProjectById(id) || existingDemoProjects[0])
  const [copied, setCopied] = useState('')

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar
          title="Credentials"
          subtitle={`${project.name} / ${project.schema}`}
        />
        <div className="p-4">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-3"
          >
            Back to projects
          </button>

          <div className="bg-white border border-gray-100 rounded-xl p-3 mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">{project.name}</p>
              <p className="text-xs text-gray-400">Schema: {project.schema}</p>
            </div>
            <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-800 mb-4">Connection details</p>

            <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
              <p className="text-xs text-gray-400">Username</p>
              <div className="flex items-center gap-2">
                <p className="text-xs font-mono text-gray-800">{project.username}</p>
                <button
                  onClick={() => handleCopy(project.username, 'username')}
                  className="text-[10px] px-2 py-0.5 border border-gray-100 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100"
                >
                  {copied === 'username' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
              <p className="text-xs text-gray-400">Schema</p>
              <div className="flex items-center gap-2">
                <p className="text-xs font-mono text-gray-800">{project.schema}</p>
                <button
                  onClick={() => handleCopy(project.schema, 'schema')}
                  className="text-[10px] px-2 py-0.5 border border-gray-100 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100"
                >
                  {copied === 'schema' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between py-2.5">
              <p className="text-xs text-gray-400">Connection URL</p>
              <div className="flex flex-col items-end gap-2 max-w-xs">
                <p className="text-xs font-mono text-gray-800 text-right break-all">
                  {project.connectionUrl}
                </p>
                <button
                  onClick={() => handleCopy(project.connectionUrl, 'url')}
                  className="text-[10px] px-2 py-0.5 border border-gray-100 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100"
                >
                  {copied === 'url' ? 'Copied' : 'Copy URL'}
                </button>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
              <button className="flex items-center gap-1 text-[10px] px-3 py-1.5 border border-gray-100 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100">
                Download .env
              </button>
              <button className="flex items-center gap-1 text-[10px] px-3 py-1.5 border border-gray-100 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100">
                Download config.json
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCredentialsPage
