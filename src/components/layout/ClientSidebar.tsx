
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Settings,
  Menu,
  X,
  LayoutDashboard,
  BarChart2,
  FileText,
  Shield,
  AlertTriangle,
  Users,
  CreditCard,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ClientSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();

  // Close sidebar on mobile view for route change
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/client/dashboard" },
    { icon: BarChart2, label: "Workflow ROI", path: "/client/roi" },
    { icon: FileText, label: "Reporting", path: "/client/reporting" },
    { icon: Shield, label: "Credentials", path: "/client/credentials" },
    { icon: AlertTriangle, label: "Exceptions", path: "/client/exceptions" },
    { icon: Users, label: "Users", path: "/client/users" },
    { icon: CreditCard, label: "Billing", path: "/client/billing" },
    { icon: MessageCircle, label: "Messaging", path: "/client/support" },
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
        className={`bg-[#faf9f8] text-gray-900 w-[210px] min-h-screen fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:translate-x-0 border-r border-gray-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-5 flex items-center">
          <Settings className="h-6 w-6 text-gray-800" />
          <span className="ml-2 font-semibold text-lg">Braintrust</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.label}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-150
                      ${active 
                        ? "bg-gray-200 text-gray-900" 
                        : "text-gray-700 hover:bg-gray-100"}`}
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

      {/* Main content wrapper with proper margin */}
      <div className="ml-0 md:ml-[210px] transition-all duration-300"></div>
    </>
  );
};

export default ClientSidebar;
