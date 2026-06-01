import { dashboardBillingData } from '../../data/demoBilling'

function BillingCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-gray-500">Current billing</p>
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
        <p className="text-2xl font-semibold text-gray-900 tracking-tight">
          Rs {dashboardBillingData.currentBilling.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 mt-1.5">Current billing period</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-gray-500">Predicted month-end</p>
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <p className="text-2xl font-semibold text-gray-900 tracking-tight">
          Rs {dashboardBillingData.predictedMonthEnd.toLocaleString()}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
            {dashboardBillingData.growthTrend}
          </span>
          <span className="text-xs text-gray-400">vs last month</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-gray-500">Billing growth trend</p>
          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <p className="text-2xl font-semibold text-gray-900 tracking-tight">
          {dashboardBillingData.billingGrowthTrend}
        </p>
        <p className="text-xs text-gray-400 mt-1.5">Projected increase</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-gray-500">Active projects</p>
          <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
          </div>
        </div>
        <p className="text-2xl font-semibold text-gray-900 tracking-tight">
          {dashboardBillingData.activeProjects}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
          <span className="text-xs text-gray-400">All running</span>
        </div>
      </div>
    </div>
  )
}

export default BillingCards
