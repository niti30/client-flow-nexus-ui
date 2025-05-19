
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const Users = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <Header />
        
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Users</h2>
            <p className="text-gray-500 mt-1">Manage your organization's users and permissions</p>
          </div>
          
          {/* Placeholder content for users */}
          <div className="bg-white rounded-md border border-gray-200 p-8 text-center text-gray-500">
            User management functionality will be implemented here
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;
