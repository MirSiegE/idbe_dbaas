const recommendationsData = [
  {
    id: 1,
    icon: '🖥️',
    title: 'Sustained CPU saturation detected',
    project: 'ecommerce_app · tenant_205',
    severity: 'High',
    severityColor: 'bg-red-50 text-red-700',
  },
  {
    id: 2,
    icon: '🗄️',
    title: 'Storage growth increasing rapidly',
    project: 'student_portal · tenant_101',
    severity: 'Medium',
    severityColor: 'bg-amber-50 text-amber-700',
  },
  {
    id: 3,
    icon: '⚡',
    title: 'Workload contention across tenants',
    project: 'Cluster level',
    severity: 'Medium',
    severityColor: 'bg-amber-50 text-amber-700',
  },
  {
    id: 4,
    icon: '🔍',
    title: 'Consider query optimization',
    project: 'student_portal · tenant_101',
    severity: 'Low',
    severityColor: 'bg-green-50 text-green-700',
  },
]

function Recommendations() {
  return (
    <div>
      <div className="bg-white border border-gray-100 rounded-xl p-3">
        <p className="text-xs font-medium text-gray-800 mb-3">Recommendations</p>

        <div className="flex flex-col">
          {recommendationsData.map((rec, index) => (
            <div
              key={rec.id}
              className={`flex items-center justify-between py-2 ${
                index !== recommendationsData.length - 1
                  ? 'border-b border-gray-100'
                  : ''
              }`}
            >
              {/* Left */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-xs">
                  {rec.icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800">{rec.title}</p>
                  <p className="text-[10px] text-gray-400">{rec.project}</p>
                </div>
              </div>

              {/* Severity Badge */}
              <span className={`text-[9px] px-2 py-0.5 rounded-full ${rec.severityColor}`}>
                {rec.severity}
              </span>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Recommendations