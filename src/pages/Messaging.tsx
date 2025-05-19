
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const Messaging = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <Header />
        
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Messaging</h2>
            <p className="text-gray-500 mt-1">Manage your communications and notifications</p>
          </div>
          
          {/* Placeholder content for messaging */}
          <div className="bg-white rounded-md border border-gray-200 p-8 text-center text-gray-500">
            Messaging functionality will be implemented here
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messaging;
