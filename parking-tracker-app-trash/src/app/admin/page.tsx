import AdminTabs from "./_components/AdminTabs";

function AdminPage() {
  return (
    <div className="w-full">
      <nav className="text-left px-2">
        <h2 className="mb-4 text-3xl font-bold">Admin Page</h2>
        <p>TODOs: set polygon axes value to the database</p>
        <p>TODOs: Use opencv2 to draw and determine polygon axes</p>
      </nav>
      <AdminTabs/>
      
    </div>
  );
}
export default AdminPage;
