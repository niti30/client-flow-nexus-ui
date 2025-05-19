
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText,
  MessagesSquare, 
  Settings,
  Menu,
  BarChart2,
  X 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ClientSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { signOut } = useAuth();

  // Close sidebar on mobile view for route change
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/client/dashboard" },
    { icon: BarChart2, label: "ROI", path: "/client/roi" },
    { icon: FileText, label: "Reporting", path: "/client/reporting" },
    { icon: Settings, label: "Credentials", path: "/client/credentials" },
    { icon: MessagesSquare, label: "Support", path: "/client/support" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Sidebar */}
      <aside 
        className={`bg-[#FAF9F8] w-[210px] min-h-screen fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-5 flex items-center">
          <Settings className="h-6 w-6 text-gray-900" />
          <span className="ml-2 font-semibold text-lg">Client Portal</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.label}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center p-3 rounded-xl transition-colors duration-150
                      ${active 
                        ? "bg-[#E3DDDD] text-gray-900" 
                        : "text-gray-900 hover:bg-gray-200"}`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="text-base">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={signOut}
            className="w-full flex items-center p-3 rounded-xl text-gray-900 hover:bg-gray-200"
          >
            <Settings className="h-5 w-5 mr-3" />
            <span className="text-base">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content wrapper with proper margin */}
      <div className="ml-0 md:ml-[210px] transition-all duration-300"></div>
    </>
  );
};

export default ClientSidebar;
