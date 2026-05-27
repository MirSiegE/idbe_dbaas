import Sidebar from '../components/dashboard/Sidebar'
import TopBar from '../components/dashboard/TopBar'
import BillingCards from '../components/dashboard/BillingCards'
import TelemetryCards from '../components/dashboard/TelemetryCards'
import Recommendations from '../components/dashboard/Recommendations'

function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">

        {/* Top Bar */}
        <TopBar
          title="Welcome back, Vaishnavi!"
          subtitle="Here is your overview"
        />

        {/* Page Content */}
        <div className="p-4 flex flex-col gap-3">
        

  {/* Create Project Button */}
  <button
    onClick={() => setShowModal(true)}
    className="self-start flex items-center gap-2 text-xs px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    + Create project
  </button>
          <BillingCards />
          <TelemetryCards />
          <Recommendations />
        </div>

      </div>
    </div>
  )
}

export default DashboardPage