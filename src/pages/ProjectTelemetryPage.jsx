import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'

const dummyProjects = {
  1: { name: 'student_portal', schema: 'tenant_101' },
  2: { name: 'ecommerce_app', schema: 'tenant_205' },
}

const telemetryData = {
  cpu: { value: '62%', status: 'High', statusColor: 'text-red-500' },
  ram: { value: '71%', status: 'Moderate', statusColor: 'text-amber-600' },
  storage: { value: '58%', status: 'Normal', statusColor: 'text-gray-400' },
  bandwidth: { value: '49%', status: 'Normal', statusColor: 'text-gray-400' },
  io: { value: '76%', status: 'Moderate', statusColor: 'text-amber-600' },
  workload: { value: 'Medium', status: 'Stable', statusColor: 'text-gray-400' },
}

const chartData = {
  cpu: [40, 55, 48, 70, 62, 80, 62],
  ram: [55, 60, 65, 68, 70, 72, 71],
  storage: [45, 47, 50, 52, 55, 57, 58],
  bandwidth: [35, 42, 50, 60, 65, 72, 76],
}

function MiniChart({ data, color }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((val, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-sm ${
            i === data.length - 1 ? color : 'bg-blue-200'
          }`}
          style={{ height: `${(val / max) * 100}%` }}
        />
      ))}
    </div>
  )
}

function ProjectTelemetryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = dummyProjects[id] || dummyProjects[1]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar
          title="Telemetry"
          subtitle={`${project.name} · ${project.schema}`}
        />
        <div className="p-4">

          {/* Back Button */}
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-3"
          >
            ← Back to projects
          </button>

          {/* Project Header */}
          <div className="bg-white border border-gray-100 rounded-xl p-3 mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">{project.name}</p>
              <p className="text-xs text-gray-400">Schema: {project.schema}</p>
            </div>
            <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>

          {/* Live Badge */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-800">Infrastructure metrics</p>
            <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">CPU utilization</p>
              <p className="text-base font-medium text-gray-800">{telemetryData.cpu.value}</p>
              <p className={`text-[10px] mt-1 ${telemetryData.cpu.statusColor}`}>{telemetryData.cpu.status}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">RAM utilization</p>
              <p className="text-base font-medium text-gray-800">{telemetryData.ram.value}</p>
              <p className={`text-[10px] mt-1 ${telemetryData.ram.statusColor}`}>{telemetryData.ram.status}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Storage usage</p>
              <p className="text-base font-medium text-gray-800">{telemetryData.storage.value}</p>
              <p className={`text-[10px] mt-1 ${telemetryData.storage.statusColor}`}>{telemetryData.storage.status}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Bandwidth usage</p>
              <p className="text-base font-medium text-gray-800">{telemetryData.bandwidth.value}</p>
              <p className={`text-[10px] mt-1 ${telemetryData.bandwidth.statusColor}`}>{telemetryData.bandwidth.status}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">I/O operations</p>
              <p className="text-base font-medium text-gray-800">{telemetryData.io.value}</p>
              <p className={`text-[10px] mt-1 ${telemetryData.io.statusColor}`}>{telemetryData.io.status}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Workload intensity</p>
              <p className="text-base font-medium text-gray-800">{telemetryData.workload.value}</p>
              <p className={`text-[10px] mt-1 ${telemetryData.workload.statusColor}`}>{telemetryData.workload.status}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-800 mb-2">CPU utilization — 7 days</p>
              <MiniChart data={chartData.cpu} color="bg-blue-400" />
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-800 mb-2">RAM utilization — 7 days</p>
              <MiniChart data={chartData.ram} color="bg-blue-400" />
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-800 mb-2">Storage usage — 7 days</p>
              <MiniChart data={chartData.storage} color="bg-blue-400" />
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-800 mb-2">Bandwidth + I/O — 7 days</p>
              <MiniChart data={chartData.bandwidth} color="bg-blue-400" />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProjectTelemetryPage