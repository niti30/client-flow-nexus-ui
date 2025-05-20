
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  CreditCard, 
  RefreshCcw, 
  MessageSquare, 
  PieChart, 
  OctagonAlert, 
  Menu, 
  X, 
  Sun,
  Moon
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();

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
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/"
    },
    {
      icon: Users,
      label: "Users",
      path: "/users"
    },
    {
      icon: Building,
      label: "Clients",
      path: "/clients"
    },
    {
      icon: CreditCard,
      label: "Billing",
      path: "/billing"
    },
    {
      icon: RefreshCcw,
      label: "Subscriptions",
      path: "/subscriptions"
    },
    {
      icon: MessageSquare,
      label: "Messaging",
      path: "/messaging"
    },
    {
      icon: PieChart,
      label: "Reporting",
      path: "/reporting"
    },
    {
      icon: OctagonAlert,
      label: "Exceptions",
      path: "/exceptions"
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleDashboardClick = (e, path) => {
    if (path === "/") {
      e.preventDefault();
      navigate("/");
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar} 
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-card shadow-md md:hidden" 
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`bg-card text-card-foreground w-[256px] min-h-screen fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:translate-x-0 border-r border-border ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center">
            {theme === 'dark' ? (
              <Sun className="h-6 w-6 text-foreground" />
            ) : (
              <Sun className="h-6 w-6 text-foreground" />
            )}
          </div>
          <button
            onClick={toggleTheme}
            className="p-1 rounded-md hover:bg-muted transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Moon className="h-5 w-5 text-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-2">
            {menuItems.map(item => {
              const active = isActive(item.path);
              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={(e) => handleDashboardClick(e, item.path)}
                    className={`flex items-center p-3 rounded-xl transition-colors duration-150
                      ${active ? "bg-black text-white dark:bg-white dark:text-black font-medium" : "text-foreground hover:bg-muted"}`}
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
      <div className="ml-0 md:ml-[256px] transition-all duration-300"></div>
    </>
  );
};

export default Sidebar;
