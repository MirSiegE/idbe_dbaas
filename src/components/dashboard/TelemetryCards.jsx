const telemetryData = [
  { label: 'CPU utilization', value: '62%', status: 'High', statusColor: 'text-red-500', statusBg: 'bg-red-50', barColor: 'bg-red-400', barWidth: '62%' },
  { label: 'RAM utilization', value: '71%', status: 'Moderate', statusColor: 'text-amber-600', statusBg: 'bg-amber-50', barColor: 'bg-amber-400', barWidth: '71%' },
  { label: 'Storage usage', value: '58%', status: 'Normal', statusColor: 'text-green-600', statusBg: 'bg-green-50', barColor: 'bg-green-400', barWidth: '58%' },
  { label: 'Bandwidth usage', value: '49%', status: 'Normal', statusColor: 'text-green-600', statusBg: 'bg-green-50', barColor: 'bg-green-400', barWidth: '49%' },
  { label: 'I/O operations', value: '76%', status: 'Moderate', statusColor: 'text-amber-600', statusBg: 'bg-amber-50', barColor: 'bg-amber-400', barWidth: '76%' },
  { label: 'Workload intensity', value: 'Medium', status: 'Stable', statusColor: 'text-green-600', statusBg: 'bg-green-50', barColor: 'bg-blue-400', barWidth: '50%' },
]

const chartData = [40, 52, 48, 65, 60, 72, 62]
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function TelemetryCards() {
  const maxVal = Math.max(...chartData)

  return (
    <div className="flex flex-col gap-4">

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-4">
        {telemetryData.map((metric, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500">{metric.label}</p>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${metric.statusBg} ${metric.statusColor}`}>
                {metric.status}
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 tracking-tight mb-3">
              {metric.value}
            </p>
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-1">
              <div
                className={`h-1 rounded-full ${metric.barColor}`}
                style={{ width: metric.barWidth }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-700">
            Overall resource usage trend
          </p>
          <span className="text-xs text-gray-400">Last 7 days</span>
        </div>
        <div className="flex items-end gap-2 h-20">
          {chartData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-sm transition-all ${
                  i === chartData.length - 1 ? 'bg-blue-500' : 'bg-blue-100'
                }`}
                style={{ height: `${(val / maxVal) * 100}%` }}
              />
              <span className="text-[9px] text-gray-300">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default TelemetryCards