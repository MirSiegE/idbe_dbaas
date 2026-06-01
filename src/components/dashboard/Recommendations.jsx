const recommendationsData = [
  {
    id: 1,
    title: 'Sustained CPU saturation detected',
    description: 'CPU usage has been above 80% for the last 2 hours',
    project: 'ecommerce_app · tenant_205',
    severity: 'High',
    severityColor: 'text-red-600',
    severityBg: 'bg-red-50',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    time: '2 min ago',
  },
  {
    id: 2,
    title: 'Storage growth increasing rapidly',
    description: 'Storage usage grew by 12% in the last 24 hours',
    project: 'student_portal · tenant_101',
    severity: 'Medium',
    severityColor: 'text-amber-600',
    severityBg: 'bg-amber-50',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    time: '10 min ago',
  },
  {
    id: 3,
    title: 'Workload contention across tenants',
    description: 'Multiple tenants competing for shared cluster resources',
    project: 'Cluster level',
    severity: 'Medium',
    severityColor: 'text-amber-600',
    severityBg: 'bg-amber-50',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    time: '15 min ago',
  },
  {
    id: 4,
    title: 'Consider query optimization',
    description: 'Several slow queries detected affecting performance',
    project: 'student_portal · tenant_101',
    severity: 'Low',
    severityColor: 'text-green-600',
    severityBg: 'bg-green-50',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500',
    time: '20 min ago',
  },
]

function Recommendations() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
      {recommendationsData.map((rec) => (
        <div
          key={rec.id}
          className="flex items-start justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
        >
          {/* Left */}
          <div className="flex items-start gap-3">

            {/* Icon */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${rec.iconBg}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${rec.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Text */}
            <div>
              <p className="text-sm font-medium text-gray-800">{rec.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{rec.description}</p>
              <p className="text-[11px] text-gray-300 mt-1">{rec.project} · {rec.time}</p>
            </div>

          </div>

          {/* Right - Severity Badge */}
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded flex-shrink-0 ml-4 mt-0.5 ${rec.severityBg} ${rec.severityColor}`}>
            {rec.severity}
          </span>

        </div>
      ))}
    </div>
  )
}

export default Recommendations