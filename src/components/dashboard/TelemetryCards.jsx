import { dashboardTelemetryData, dashboardTelemetryTrend } from '../../data/demoTelemetry'

function TelemetryCards() {
  const maxVal = Math.max(...dashboardTelemetryTrend.values)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {dashboardTelemetryData.map((metric, index) => (
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
            <div className="w-full bg-gray-100 rounded-full h-1">
              <div
                className={`h-1 rounded-full ${metric.barColor}`}
                style={{ width: metric.barWidth }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-700">
            Overall resource usage trend
          </p>
          <span className="text-xs text-gray-400">Last 7 days</span>
        </div>
        <div className="flex items-end gap-2 h-20">
          {dashboardTelemetryTrend.values.map((val, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-sm transition-all ${
                  index === dashboardTelemetryTrend.values.length - 1 ? 'bg-blue-500' : 'bg-blue-100'
                }`}
                style={{ height: `${(val / maxVal) * 100}%` }}
              />
              <span className="text-[9px] text-gray-300">
                {dashboardTelemetryTrend.labels[index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TelemetryCards
