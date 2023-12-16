import AdminTabs from "./_components/AdminTabs";
import LatestImage from "./_components/image";
function AdminPage() {
  return (

    <div className="w-full bg-blue-900 text-white">
      <LatestImage folderPath="images" alt="Latest Image" />
      <nav className="text-left px-2">
        <h2 className="mb-4 text-3xl font-bold">Admin Page</h2>
        <p>TODOs: set polygon axes value to the database</p>
        <p>TODOs: Use opencv2 to draw and determine polygon axes</p>
      </nav>
      <AdminTabs />
    </div>
  );
}

export default AdminPage;