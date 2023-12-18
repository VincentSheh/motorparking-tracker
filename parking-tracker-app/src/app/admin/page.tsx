import AdminTabs from "./_components/AdminTabs";
import LatestImage from "./_components/image";

function AdminPage() {
  return (
    <div className="w-full bg-gray-100 text-black">
      <nav className="text-left px-2 bg-gray-200 h-16 pl-20 border-r border-black border-2">
        <h2 className="text-3xl" style={{ fontFamily: 'Comic Sans MS', fontWeight: 'bold' }}>
          ADMIN PAGE
        </h2>
      </nav>
      <AdminTabs />
    </div>
  );
}

export default AdminPage;
