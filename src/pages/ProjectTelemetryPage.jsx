import { useParams, useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'
import { existingDemoProjects, getProjectById } from '../data/demoProjects'
import {
  derivedMetrics,
  infraMetrics,
  infraTrendData,
  workloadTrendData,
} from '../data/demoTelemetry'

function ProjectTelemetryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = getProjectById(id) || existingDemoProjects[0]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar
          title="Telemetry"
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
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                Live
              </span>
              <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-800 mb-3">
                CPU, RAM, Storage - 6 days
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
                Bandwidth, I/O, Workload - 6 days
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

          <p className="text-xs font-medium text-gray-800 mb-2">
            Derived tenant metrics
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {derivedMetrics.map((metric) => (
              <div key={metric.label} className="bg-white border border-gray-100 rounded-xl p-2.5">
                <p className="text-[10px] text-gray-400 mb-1">{metric.label}</p>
                <p className="text-base font-medium text-gray-800">{metric.value}</p>
                <p className={`text-[10px] mt-1 ${metric.statusColor}`}>{metric.status}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-3">
            <p className="text-xs font-medium text-gray-800 mb-3">
              Tenant workload share - 6 days
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
