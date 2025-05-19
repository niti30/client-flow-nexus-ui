
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CreditCard, 
  BarChart, 
  AlertTriangle, 
  MessagesSquare,
  FileText,
  Settings,
  RotateCcw,
  Menu,
  X 
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change for mobile view
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Users", path: "/users" },
    { icon: Briefcase, label: "Clients", path: "/clients" },
    { icon: CreditCard, label: "Billing", path: "/billing" },
    { icon: RotateCcw, label: "Subscriptions", path: "/subscriptions" },
    { icon: MessagesSquare, label: "Messaging", path: "/messaging" },
    { icon: FileText, label: "Reporting", path: "/reporting" },
    { icon: AlertTriangle, label: "Exceptions", path: "/exceptions" }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-white shadow-md"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`bg-[#f9f9f9] w-[220px] fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          flex flex-col border-r border-gray-200`}
      >
        <div className="p-4 flex items-center">
          <Settings className="h-5 w-5 text-gray-600" />
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.label}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center p-2.5 rounded-md transition-colors duration-150
                      ${active 
                        ? "bg-black text-white" 
                        : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"}`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
