function LeftSection() {
  return (
    <div className="flex-1">
      
      {/* Tags */}
      <div className="flex gap-4 mb-6 text-sm text-gray-500">
        <span>✦ Telemetry-driven</span>
        <span>• Billing Intelligence</span>
        <span>• Predictive Insights</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
        Intelligent PostgreSQL.<br />
        Built for <span className="text-blue-600">Scale.</span>
      </h1>

      {/* Description */}
      <p className="text-gray-500 mb-8 text-base leading-relaxed">
        InteliDB Enterprise helps teams monitor, analyze and optimize
        PostgreSQL workloads with real-time telemetry, usage-based
        billing and smart recommendations.
      </p>

      {/* Features List */}
      <div className="space-y-4">
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            📊
          </div>
          <div>
            <p className="font-semibold text-gray-800">Real-time Telemetry</p>
            <p className="text-sm text-gray-500">Monitor every resource and workload in real time.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
            💰
          </div>
          <div>
            <p className="font-semibold text-gray-800">Usage-based Billing</p>
            <p className="text-sm text-gray-500">Transparent, accurate and predictive billing for every project.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
            ⚡
          </div>
          <div>
            <p className="font-semibold text-gray-800">Smart Recommendations</p>
            <p className="text-sm text-gray-500">AI-driven insights to optimize performance and reduce costs.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
            🛡️
          </div>
          <div>
            <p className="font-semibold text-gray-800">Enterprise Ready</p>
            <p className="text-sm text-gray-500">Secure, reliable and built for mission-critical workloads.</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default LeftSection