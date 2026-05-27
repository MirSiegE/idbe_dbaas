import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'

const dummyProjects = {
  1: { name: 'student_portal', schema: 'tenant_101' },
  2: { name: 'ecommerce_app', schema: 'tenant_205' },
}

const billingData = {
  currentBilling: 1245,
  predictedMonthEnd: 3800,
  growthTrend: '+18%',
  workloadCostChange: '+₹240',
  breakdown: [
    { label: 'Infrastructure', amount: 480 },
    { label: 'Workload', amount: 360 },
    { label: 'Monitoring', amount: 210 },
    { label: 'ML Analytics', amount: 120 },
    { label: 'Platform fee', amount: 75 },
  ],
  resourceUsage: [
    { label: 'CPU-hours', value: '148 hrs', cost: '₹320' },
    { label: 'RAM usage', value: '72 GB', cost: '₹160' },
    { label: 'Storage', value: '45 GB', cost: '₹95' },
    { label: 'Bandwidth', value: '18 GB', cost: '₹54' },
    { label: 'I/O operations', value: '2.4M ops', cost: '₹48' },
  ],
}

const chartData = [25, 35, 42, 50, 58, 65, 72]

function ProjectBillingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = dummyProjects[id] || dummyProjects[1]
  const max = Math.max(...chartData)

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
              <p className="text-base font-medium text-blue-700">
                ₹{billingData.currentBilling.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">This period</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Predicted month-end</p>
              <p className="text-base font-medium text-gray-800">
                ₹{billingData.predictedMonthEnd.toLocaleString()}
              </p>
              <span className="text-[9px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                {billingData.growthTrend} vs last month
              </span>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Billing growth trend</p>
              <p className="text-base font-medium text-gray-800">{billingData.growthTrend}</p>
              <p className="text-[10px] text-gray-400 mt-1">vs last month</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Workload cost change</p>
              <p className="text-base font-medium text-gray-800">{billingData.workloadCostChange}</p>
              <p className="text-[10px] text-gray-400 mt-1">vs last period</p>
            </div>
          </div>

          {/* Cost Breakdown + Chart */}
          <div className="grid grid-cols-2 gap-3 mb-4">

            {/* Cost Breakdown */}
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-800 mb-3">Cost breakdown</p>
              {billingData.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between py-1.5 border-b border-gray-50 text-xs"
                >
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-gray-800">₹{item.amount}</span>
                </div>
              ))}
              <div className="flex justify-between py-1.5 text-xs font-medium">
                <span>Total</span>
                <span className="text-blue-700">
                  ₹{billingData.currentBilling.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Billing Trend Chart */}
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-800 mb-3">
                Billing trend — this month
              </p>
              <div className="flex items-end gap-1 h-28">
                {chartData.map((val, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm ${
                      i === chartData.length - 1 ? 'bg-blue-400' : 'bg-blue-200'
                    }`}
                    style={{ height: `${(val / max) * 100}%` }}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Resource Usage Costs */}
          <p className="text-xs font-medium text-gray-800 mb-2">Resource usage costs</p>
          <div className="grid grid-cols-3 gap-2">
            {billingData.resourceUsage.map((item, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-xl p-2.5">
                <p className="text-[10px] text-gray-400 mb-1">{item.label}</p>
                <p className="text-base font-medium text-gray-800">{item.value}</p>
                <p className="text-[10px] text-gray-400 mt-1">{item.cost} this period</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProjectBillingPage