export const dashboardBillingData = {
  currentBilling: 8240,
  predictedMonthEnd: 12500,
  growthTrend: '+22%',
  billingGrowthTrend: '+32.3%',
  activeProjects: 2,
}

export const projectBillingSummary = {
  currentBilling: 'Rs 1,245',
  predictedMonthEnd: 'Rs 3,800',
  billingGrowthTrend: '+18%',
  workloadCostChange: '+Rs 240',
}

export const billingTrendData = [
  { day: 'May 1', actual: 200, predicted: 220 },
  { day: 'May 5', actual: 450, predicted: 480 },
  { day: 'May 10', actual: 700, predicted: 750 },
  { day: 'May 15', actual: 950, predicted: 1050 },
  { day: 'May 20', actual: 1100, predicted: 1300 },
  { day: 'May 25', actual: 1245, predicted: 1600 },
  { day: 'May 31', actual: null, predicted: 3800 },
]

export const costBreakdownData = [
  { name: 'Infrastructure', value: 480 },
  { name: 'Workload', value: 360 },
  { name: 'Monitoring', value: 210 },
  { name: 'ML Analytics', value: 120 },
  { name: 'Platform fee', value: 75 },
]

export const costBreakdownColors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']

export const resourceUsageData = [
  { day: 'Mon', cpu: 120, ram: 60, storage: 40, bandwidth: 15, io: 1.8 },
  { day: 'Tue', cpu: 132, ram: 65, storage: 41, bandwidth: 16, io: 2.0 },
  { day: 'Wed', cpu: 125, ram: 68, storage: 42, bandwidth: 17, io: 2.1 },
  { day: 'Thu', cpu: 140, ram: 70, storage: 43, bandwidth: 17, io: 2.2 },
  { day: 'Fri', cpu: 145, ram: 71, storage: 44, bandwidth: 18, io: 2.3 },
  { day: 'Sat', cpu: 148, ram: 72, storage: 45, bandwidth: 18, io: 2.4 },
]

export const resourceCards = [
  { label: 'CPU-hours', value: '148 hrs', cost: 'Rs 320' },
  { label: 'RAM usage', value: '72 GB', cost: 'Rs 160' },
  { label: 'Storage', value: '45 GB', cost: 'Rs 95' },
  { label: 'Bandwidth', value: '18 GB', cost: 'Rs 54' },
  { label: 'I/O operations', value: '2.4M ops', cost: 'Rs 48' },
]
