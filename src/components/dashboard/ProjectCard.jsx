import { useNavigate } from 'react-router-dom'

function ProjectCard({ project }) {
  const navigate = useNavigate()

  return (
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
          <button className="text-gray-400 hover:text-gray-600 text-sm">⋯</button>
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
  )
}

export default ProjectCard