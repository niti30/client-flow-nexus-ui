
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
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const handleSignOut = async () => {
    try {
      console.log("Client logout - Attempting to sign out");
      
      // Clean up auth state
      localStorage.removeItem('supabase.auth.token');
      
      // Remove all Supabase auth keys
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Also clean from sessionStorage if used
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.error("Error during supabase signOut:", err);
        // Continue even if this fails
      }
      
      if (signOut) {
        await signOut();
        console.log("Client logout - Successfully signed out");
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account",
        });
        // Force page reload for a clean state
        window.location.href = '/auth';
      }
    } catch (error) {
      console.error("Client logout - Error during sign out:", error);
      toast({
        title: "Logout failed",
        description: "There was an error during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/client/dashboard" },
    { icon: BarChart2, label: "Workflow ROI", path: "/client/roi" },
    { icon: FileText, label: "Reporting", path: "/client/reporting" },
    { icon: Shield, label: "Credentials", path: "/client/credentials" },
    { icon: AlertTriangle, label: "Exceptions", path: "/client/exceptions" },
    { icon: Users, label: "Users", path: "/client/users" },
    { icon: CreditCard, label: "Billing", path: "/client/billing" },
    { icon: MessageSquare, label: "Messaging", path: "/client/messaging" },
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
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.label}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center p-3 rounded-xl transition-colors duration-150
                      ${active 
                        ? "bg-gray-200 text-gray-900" 
                        : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="text-base">{item.label}</span>
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
