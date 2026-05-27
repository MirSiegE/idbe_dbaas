import { useParams, useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'

const dummyProjects = {
  1: { name: 'student_portal', schema: 'tenant_101' },
  2: { name: 'ecommerce_app', schema: 'tenant_205' },
}

const billingTrendData = [
  { day: 'May 1', actual: 200, predicted: 220 },
  { day: 'May 5', actual: 450, predicted: 480 },
  { day: 'May 10', actual: 700, predicted: 750 },
  { day: 'May 15', actual: 950, predicted: 1050 },
  { day: 'May 20', actual: 1100, predicted: 1300 },
  { day: 'May 25', actual: 1245, predicted: 1600 },
  { day: 'May 31', actual: null, predicted: 3800 },
]

const costBreakdownData = [
  { name: 'Infrastructure', value: 480 },
  { name: 'Workload', value: 360 },
  { name: 'Monitoring', value: 210 },
  { name: 'ML Analytics', value: 120 },
  { name: 'Platform fee', value: 75 },
]

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']

const resourceUsageData = [
  { day: 'Mon', cpu: 120, ram: 60, storage: 40, bandwidth: 15, io: 1.8 },
  { day: 'Tue', cpu: 132, ram: 65, storage: 41, bandwidth: 16, io: 2.0 },
  { day: 'Wed', cpu: 125, ram: 68, storage: 42, bandwidth: 17, io: 2.1 },
  { day: 'Thu', cpu: 140, ram: 70, storage: 43, bandwidth: 17, io: 2.2 },
  { day: 'Fri', cpu: 145, ram: 71, storage: 44, bandwidth: 18, io: 2.3 },
  { day: 'Sat', cpu: 148, ram: 72, storage: 45, bandwidth: 18, io: 2.4 },
]

const resourceCards = [
  { label: 'CPU-hours', value: '148 hrs', cost: '₹320' },
  { label: 'RAM usage', value: '72 GB', cost: '₹160' },
  { label: 'Storage', value: '45 GB', cost: '₹95' },
  { label: 'Bandwidth', value: '18 GB', cost: '₹54' },
  { label: 'I/O operations', value: '2.4M ops', cost: '₹48' },
]

function ProjectBillingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = dummyProjects[id] || dummyProjects[1]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar
          title="Billing"
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

          {/* Billing Cards */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-white border-2 border-blue-300 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Current billing</p>
              <p className="text-base font-medium text-blue-700">₹1,245</p>
              <p className="text-[10px] text-gray-400 mt-1">This period</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Predicted month-end</p>
              <p className="text-base font-medium text-gray-800">₹3,800</p>
              <span className="text-[9px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                +18% vs last month
              </span>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Billing growth trend</p>
              <p className="text-base font-medium text-gray-800">+18%</p>
              <p className="text-[10px] text-gray-400 mt-1">vs last month</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Workload cost change</p>
              <p className="text-base font-medium text-gray-800">+₹240</p>
              <p className="text-[10px] text-gray-400 mt-1">vs last period</p>
            </div>
          </div>

          {/* Line Chart + Donut Chart */}
          <div className="grid grid-cols-2 gap-3 mb-4">

            {/* Billing Trend Line Chart */}
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-800 mb-3">
                Billing trend — actual vs predicted
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={billingTrendData}>
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Actual"
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#bfdbfe"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3 }}
                    name="Predicted"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Cost Breakdown Donut Chart */}
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-800 mb-3">
                Cost breakdown
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={costBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ₹${value}`}
                    labelLine={false}
                  >
                    {costBreakdownData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* Resource Usage */}
          <p className="text-xs font-medium text-gray-800 mb-2">
            Resource usage costs
          </p>

          {/* Resource Numerical Cards */}
          <div className="grid grid-cols-5 gap-2 mb-3">
            {resourceCards.map((item, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-xl p-2.5">
                <p className="text-[10px] text-gray-400 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-gray-800">{item.value}</p>
                <p className="text-[10px] text-gray-400 mt-1">{item.cost} this period</p>
              </div>
            ))}
          </div>

          {/* Resource Usage Bar Chart */}
          <div className="bg-white border border-gray-100 rounded-xl p-3">
            <p className="text-xs font-medium text-gray-800 mb-3">
              Resource usage — last 6 days
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={resourceUsageData}>
                <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="cpu" fill="#3b82f6" name="CPU-hours" />
                <Bar dataKey="ram" fill="#60a5fa" name="RAM (GB)" />
                <Bar dataKey="storage" fill="#93c5fd" name="Storage (GB)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProjectBillingPage