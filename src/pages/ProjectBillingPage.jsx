import { useParams, useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'
import {
  billingTrendData,
  costBreakdownColors,
  costBreakdownData,
  projectBillingSummary,
  resourceCards,
  resourceUsageData,
} from '../data/demoBilling'
import { existingDemoProjects, getProjectById } from '../data/demoProjects'

function ProjectBillingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = getProjectById(id) || existingDemoProjects[0]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar
          title="Billing"
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

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-white border-2 border-blue-300 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Current billing</p>
              <p className="text-base font-medium text-blue-700">{projectBillingSummary.currentBilling}</p>
              <p className="text-[10px] text-gray-400 mt-1">This period</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Predicted month-end</p>
              <p className="text-base font-medium text-gray-800">{projectBillingSummary.predictedMonthEnd}</p>
              <span className="text-[9px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                +18% vs last month
              </span>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Billing growth trend</p>
              <p className="text-base font-medium text-gray-800">{projectBillingSummary.billingGrowthTrend}</p>
              <p className="text-[10px] text-gray-400 mt-1">vs last month</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Workload cost change</p>
              <p className="text-base font-medium text-gray-800">{projectBillingSummary.workloadCostChange}</p>
              <p className="text-[10px] text-gray-400 mt-1">vs last period</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-800 mb-3">
                Billing trend - actual vs predicted
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={billingTrendData}>
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Actual" />
                  <Line type="monotone" dataKey="predicted" stroke="#bfdbfe" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Predicted" />
                </LineChart>
              </ResponsiveContainer>
            </div>

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
                    label={({ name, value }) => `${name}: Rs ${value}`}
                    labelLine={false}
                  >
                    {costBreakdownData.map((entry, index) => (
                      <Cell key={entry.name} fill={costBreakdownColors[index % costBreakdownColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `Rs ${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="text-xs font-medium text-gray-800 mb-2">
            Resource usage costs
          </p>

          <div className="grid grid-cols-5 gap-2 mb-3">
            {resourceCards.map((item) => (
              <div key={item.label} className="bg-white border border-gray-100 rounded-xl p-2.5">
                <p className="text-[10px] text-gray-400 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-gray-800">{item.value}</p>
                <p className="text-[10px] text-gray-400 mt-1">{item.cost} this period</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-3">
            <p className="text-xs font-medium text-gray-800 mb-3">
              Resource usage - last 6 days
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
