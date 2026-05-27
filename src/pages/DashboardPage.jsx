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
          <BillingCards />
          <TelemetryCards />
          <Recommendations />
        </div>

      </div>
    </div>
  )
}

export default DashboardPage