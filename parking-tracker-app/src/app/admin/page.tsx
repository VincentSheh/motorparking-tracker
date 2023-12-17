import AdminTabs from "./_components/AdminTabs";
import LatestImage from "./_components/image";

function AdminPage() {
  return (
    <div className="w-full bg-orange-200 text-black">
      <nav className="text-left px-2 bg-gray-200 h-16 pl-20">
        <h2 className="text-3xl" style={{ fontFamily: 'cursive'}}>
          Admin Page
        </h2>
      </nav>
      <AdminTabs />
    </div>
  );
}

export default AdminPage;
