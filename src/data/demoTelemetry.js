export const dashboardTelemetryData = [
  { label: 'CPU utilization', value: '62%', status: 'High', statusColor: 'text-red-500', statusBg: 'bg-red-50', barColor: 'bg-red-400', barWidth: '62%' },
  { label: 'RAM utilization', value: '71%', status: 'Moderate', statusColor: 'text-amber-600', statusBg: 'bg-amber-50', barColor: 'bg-amber-400', barWidth: '71%' },
  { label: 'Storage usage', value: '58%', status: 'Normal', statusColor: 'text-green-600', statusBg: 'bg-green-50', barColor: 'bg-green-400', barWidth: '58%' },
  { label: 'Bandwidth usage', value: '49%', status: 'Normal', statusColor: 'text-green-600', statusBg: 'bg-green-50', barColor: 'bg-green-400', barWidth: '49%' },
  { label: 'I/O operations', value: '76%', status: 'Moderate', statusColor: 'text-amber-600', statusBg: 'bg-amber-50', barColor: 'bg-amber-400', barWidth: '76%' },
  { label: 'Workload intensity', value: 'Medium', status: 'Stable', statusColor: 'text-green-600', statusBg: 'bg-green-50', barColor: 'bg-blue-400', barWidth: '50%' },
]

export const dashboardTelemetryTrend = {
  values: [40, 52, 48, 65, 60, 72, 62],
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}

export const infraMetrics = {
  cpu: { value: '62%', status: 'High', statusColor: 'text-red-500' },
  ram: { value: '71%', status: 'Moderate', statusColor: 'text-amber-600' },
  storage: { value: '58%', status: 'Normal', statusColor: 'text-gray-400' },
  bandwidth: { value: '49%', status: 'Normal', statusColor: 'text-gray-400' },
  io: { value: '76%', status: 'Moderate', statusColor: 'text-amber-600' },
  workload: { value: 'Medium', status: 'Stable', statusColor: 'text-gray-400' },
}

export const derivedMetrics = [
  { label: 'Tenant resource consumption', value: '41%', status: 'Normal', statusColor: 'text-gray-400' },
  { label: 'Tenant bandwidth activity', value: '18 GB', status: 'Normal', statusColor: 'text-gray-400' },
  { label: 'Tenant storage activity', value: '45 GB', status: 'Normal', statusColor: 'text-gray-400' },
  { label: 'Query workload intensity', value: 'Medium', status: 'Stable', statusColor: 'text-gray-400' },
  { label: 'Tenant workload share', value: '32%', status: 'Normal', statusColor: 'text-gray-400' },
  { label: 'Cluster workload imbalance', value: 'Low', status: 'Stable', statusColor: 'text-green-500' },
]

export const infraTrendData = [
  { day: 'Mon', cpu: 50, ram: 60, storage: 45 },
  { day: 'Tue', cpu: 55, ram: 63, storage: 47 },
  { day: 'Wed', cpu: 58, ram: 66, storage: 50 },
  { day: 'Thu', cpu: 62, ram: 68, storage: 53 },
  { day: 'Fri', cpu: 60, ram: 70, storage: 55 },
  { day: 'Sat', cpu: 62, ram: 71, storage: 58 },
]

export const workloadTrendData = [
  { day: 'Mon', bandwidth: 12, io: 1.8, workload: 25 },
  { day: 'Tue', bandwidth: 14, io: 2.0, workload: 28 },
  { day: 'Wed', bandwidth: 15, io: 2.1, workload: 30 },
  { day: 'Thu', bandwidth: 16, io: 2.2, workload: 32 },
  { day: 'Fri', bandwidth: 17, io: 2.3, workload: 31 },
  { day: 'Sat', bandwidth: 18, io: 2.4, workload: 32 },
]
