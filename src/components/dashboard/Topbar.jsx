function TopBar({ title, subtitle }) {
  return (
    <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between">

      {/* Left - Title */}
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>

      {/* Right - Bell + Avatar */}
      <div className="flex items-center gap-2">
        <button className="w-7 h-7 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50">
          🔔
        </button>
        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-xs font-medium text-blue-700">
          V
        </div>
      </div>

    </div>
  )
}

export default TopBar