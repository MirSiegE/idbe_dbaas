import DashboardLayout from "../components/dashboard/DashboardLayout";

function ProjectsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-white">
          Projects
        </h1>

        <p className="text-gray-400 mt-2">
          Manage all your database projects here.
        </p>

        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
          Create Project
        </button>
      </div>
    </DashboardLayout>
  );
}

export default ProjectsPage;