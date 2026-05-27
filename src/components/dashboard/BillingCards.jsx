const billingData = {
  currentBilling: 8240,
  predictedMonthEnd: 12500,
  growthTrend: "+22%",
  activeProjects: 2,
}

function BillingCards() {
  return (
    <div>
      <p className="text-xs font-medium text-gray-800 mb-2">Billing overview</p>

      <div className="grid grid-cols-4 gap-2 mb-3">

        {/* Current Billing */}
        <div className="bg-white border-2 border-blue-300 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400 mb-1">Current billing</p>
          <p className="text-base font-medium text-blue-700">
            ₹{billingData.currentBilling.toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">This period</p>
        </div>

        {/* Predicted Month End */}
        <div className="bg-white border border-gray-100 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400 mb-1">Predicted month-end</p>
          <p className="text-base font-medium text-gray-800">
            ₹{billingData.predictedMonthEnd.toLocaleString()}
          </p>
          <span className="text-[9px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded-full mt-1 inline-block">
            {billingData.growthTrend} vs last month
          </span>
        </div>

        {/* Billing Growth Trend */}
        <div className="bg-white border border-gray-100 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400 mb-1">Billing growth trend</p>
          <p className="text-base font-medium text-gray-800">+32.3%</p>
          <p className="text-[10px] text-gray-400 mt-1">Projected increase</p>
        </div>

        {/* Active Projects */}
        <div className="bg-white border border-gray-100 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400 mb-1">Active projects</p>
          <p className="text-base font-medium text-gray-800">
            {billingData.activeProjects}
          </p>
          <span className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full mt-1 inline-block">
            All running
          </span>
        </div>

      </div>
    </div>
  )
}

export default BillingCards