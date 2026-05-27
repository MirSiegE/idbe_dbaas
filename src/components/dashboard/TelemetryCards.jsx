const telemetryData = {
  cpu: { value: '62%', status: 'High', statusColor: 'text-red-500' },
  ram: { value: '71%', status: 'Moderate', statusColor: 'text-amber-600' },
  storage: { value: '58%', status: 'Normal', statusColor: 'text-gray-400' },
  bandwidth: { value: '49%', status: 'Normal', statusColor: 'text-gray-400' },
  io: { value: '76%', status: 'Moderate', statusColor: 'text-amber-600' },
  workload: { value: 'Medium', status: 'Stable', statusColor: 'text-gray-400' },
}

const chartData = [40, 52, 48, 65, 60, 72, 62]

function TelemetryCards() {
  const maxVal = Math.max(...chartData)

  return (
    <div>
      <p className="text-xs font-medium text-gray-800 mb-2">Overall telemetry</p>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">

        <div className="bg-white border border-gray-100 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400 mb-1">CPU utilization</p>
          <p className="text-base font-medium text-gray-800">{telemetryData.cpu.value}</p>
          <p className={`text-[10px] mt-1 ${telemetryData.cpu.statusColor}`}>
            {telemetryData.cpu.status}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400 mb-1">RAM utilization</p>
          <p className="text-base font-medium text-gray-800">{telemetryData.ram.value}</p>
          <p className={`text-[10px] mt-1 ${telemetryData.ram.statusColor}`}>
            {telemetryData.ram.status}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400 mb-1">Storage usage</p>
          <p className="text-base font-medium text-gray-800">{telemetryData.storage.value}</p>
          <p className={`text-[10px] mt-1 ${telemetryData.storage.statusColor}`}>
            {telemetryData.storage.status}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400 mb-1">Bandwidth usage</p>
          <p className="text-base font-medium text-gray-800">{telemetryData.bandwidth.value}</p>
          <p className={`text-[10px] mt-1 ${telemetryData.bandwidth.statusColor}`}>
            {telemetryData.bandwidth.status}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400 mb-1">I/O operations</p>
          <p className="text-base font-medium text-gray-800">{telemetryData.io.value}</p>
          <p className={`text-[10px] mt-1 ${telemetryData.io.statusColor}`}>
            {telemetryData.io.status}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400 mb-1">Workload intensity</p>
          <p className="text-base font-medium text-gray-800">{telemetryData.workload.value}</p>
          <p className={`text-[10px] mt-1 ${telemetryData.workload.statusColor}`}>
            {telemetryData.workload.status}
          </p>
        </div>

      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-100 rounded-xl p-3 mb-3">
        <p className="text-xs font-medium text-gray-800 mb-3">
          Overall resource usage trend
        </p>
        <div className="flex items-end gap-1 h-14">
          {chartData.map((val, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-sm ${
                i === chartData.length - 1 ? 'bg-blue-400' : 'bg-blue-200'
              }`}
              style={{ height: `${(val / maxVal) * 100}%` }}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

export default TelemetryCards