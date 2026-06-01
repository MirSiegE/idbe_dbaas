function TopBar({ title, subtitle }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">

      {/* Left - Breadcrumb style title */}
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {subtitle && (
          <>
            <span className="text-gray-300 text-sm">/</span>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </>
        )}
      </div>

      {/* Right - Bell + Avatar */}
      <div className="flex items-center gap-2">

        {/* Notification Bell */}
        <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200"></div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[11px] font-semibold text-white">
            V
          </div>
          <span className="text-sm text-gray-600 font-medium">Vaishnavi</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

      </div>

    </div>
  )
}

export default TopBar