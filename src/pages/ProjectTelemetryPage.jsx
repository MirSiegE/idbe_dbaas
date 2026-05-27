import { useParams, useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'

const dummyProjects = {
  1: { name: 'student_portal', schema: 'tenant_101' },
  2: { name: 'ecommerce_app', schema: 'tenant_205' },
}

const infraMetrics = {
  cpu: { value: '62%', status: 'High', statusColor: 'text-red-500' },
  ram: { value: '71%', status: 'Moderate', statusColor: 'text-amber-600' },
  storage: { value: '58%', status: 'Normal', statusColor: 'text-gray-400' },
  bandwidth: { value: '49%', status: 'Normal', statusColor: 'text-gray-400' },
  io: { value: '76%', status: 'Moderate', statusColor: 'text-amber-600' },
  workload: { value: 'Medium', status: 'Stable', statusColor: 'text-gray-400' },
}

const derivedMetrics = [
  { label: 'Tenant resource consumption', value: '41%', status: 'Normal', statusColor: 'text-gray-400' },
  { label: 'Tenant bandwidth activity', value: '18 GB', status: 'Normal', statusColor: 'text-gray-400' },
  { label: 'Tenant storage activity', value: '45 GB', status: 'Normal', statusColor: 'text-gray-400' },
  { label: 'Query workload intensity', value: 'Medium', status: 'Stable', statusColor: 'text-gray-400' },
  { label: 'Tenant workload share', value: '32%', status: 'Normal', statusColor: 'text-gray-400' },
  { label: 'Cluster workload imbalance', value: 'Low', status: 'Stable', statusColor: 'text-green-500' },
]

const infraTrendData = [
  { day: 'Mon', cpu: 50, ram: 60, storage: 45 },
  { day: 'Tue', cpu: 55, ram: 63, storage: 47 },
  { day: 'Wed', cpu: 58, ram: 66, storage: 50 },
  { day: 'Thu', cpu: 62, ram: 68, storage: 53 },
  { day: 'Fri', cpu: 60, ram: 70, storage: 55 },
  { day: 'Sat', cpu: 62, ram: 71, storage: 58 },
]

const workloadTrendData = [
  { day: 'Mon', bandwidth: 12, io: 1.8, workload: 25 },
  { day: 'Tue', bandwidth: 14, io: 2.0, workload: 28 },
  { day: 'Wed', bandwidth: 15, io: 2.1, workload: 30 },
  { day: 'Thu', bandwidth: 16, io: 2.2, workload: 32 },
  { day: 'Fri', bandwidth: 17, io: 2.3, workload: 31 },
  { day: 'Sat', bandwidth: 18, io: 2.4, workload: 32 },
]

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
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                Live
              </span>
              <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
          </div>

          {/* Infrastructure Metrics */}
          <p className="text-xs font-medium text-gray-800 mb-2">
            Infrastructure metrics
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {Object.entries(infraMetrics).map(([key, metric]) => (
              <div key={key} className="bg-white border border-gray-100 rounded-xl p-2.5">
                <p className="text-[10px] text-gray-400 mb-1 capitalize">
                  {key === 'io' ? 'I/O operations' : key.replace(/([A-Z])/g, ' $1')} 
                </p>
                <p className="text-base font-medium text-gray-800">{metric.value}</p>
                <p className={`text-[10px] mt-1 ${metric.statusColor}`}>{metric.status}</p>
              </div>
            ))}
          </div>

          {/* Infrastructure Charts */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-800 mb-3">
                CPU, RAM, Storage — 6 days
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={infraTrendData}>
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} name="CPU %" dot={false} />
                  <Line type="monotone" dataKey="ram" stroke="#60a5fa" strokeWidth={2} name="RAM %" dot={false} />
                  <Line type="monotone" dataKey="storage" stroke="#93c5fd" strokeWidth={2} name="Storage %" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-800 mb-3">
                Bandwidth, I/O, Workload — 6 days
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={workloadTrendData}>
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="bandwidth" stroke="#3b82f6" strokeWidth={2} name="Bandwidth GB" dot={false} />
                  <Line type="monotone" dataKey="io" stroke="#60a5fa" strokeWidth={2} name="I/O ops" dot={false} />
                  <Line type="monotone" dataKey="workload" stroke="#93c5fd" strokeWidth={2} name="Workload %" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Derived Tenant Metrics */}
          <p className="text-xs font-medium text-gray-800 mb-2">
            Derived tenant metrics
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {derivedMetrics.map((metric, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-xl p-2.5">
                <p className="text-[10px] text-gray-400 mb-1">{metric.label}</p>
                <p className="text-base font-medium text-gray-800">{metric.value}</p>
                <p className={`text-[10px] mt-1 ${metric.statusColor}`}>{metric.status}</p>
              </div>
            ))}
          </div>

          {/* Workload Bar Chart */}
          <div className="bg-white border border-gray-100 rounded-xl p-3">
            <p className="text-xs font-medium text-gray-800 mb-3">
              Tenant workload share — 6 days
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={workloadTrendData}>
                <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="workload" fill="#3b82f6" name="Workload %" />
                <Bar dataKey="bandwidth" fill="#93c5fd" name="Bandwidth GB" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProjectTelemetryPage