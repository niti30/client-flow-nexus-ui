
import { useState, useEffect } from "react";
import { Bell, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const Header = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, userRole } = useAuth();
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    // Set current user based on auth context
    if (user) {
      setCurrentUser({
        name: user.user_metadata?.name || user.email?.substring(0, 2)?.toUpperCase() || "AU",
        avatar: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || "A U")}&background=1785c1&color=fff`
      });
    } else {
      setCurrentUser({
        name: "AU",
        avatar: "https://ui-avatars.com/api/?name=A+U&background=1785c1&color=fff"
      });
    }

    // Set page title based on current route
    const pathname = location.pathname;
    if (pathname === "/") {
      setPageTitle("Dashboard Overview");
    } else if (pathname.includes("/clients/")) {
      setPageTitle("Client Manager");
    } else if (pathname === "/users") {
      setPageTitle("User Manager");
    } else if (pathname === "/billing") {
      setPageTitle("Billing");
    } else if (pathname === "/workflows") {
      setPageTitle("Workflows");
    } else if (pathname === "/exceptions") {
      setPageTitle("Exceptions");
    } else if (pathname === "/subscriptions") {
      setPageTitle("Plan Manager");
    } else if (pathname === "/clients") {
      setPageTitle("Clients");
    } else if (pathname === "/reporting") {
      setPageTitle("Reporting");
    } else if (pathname === "/messaging") {
      setPageTitle("Messaging");
    } else if (pathname === "/profile") {
      setPageTitle("My Profile");
    } else if (pathname === "/settings") {
      setPageTitle("Settings");
    } else {
      setPageTitle("Dashboard");
    }
  }, [location, user]);

  const handleSignOut = async () => {
    try {
      // Call the signOut method from AuthContext
      if (signOut) {
        await signOut();
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout failed",
        description: "There was an error during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
              {currentUser && (
                <>
                  <div className="h-8 w-8 rounded-full bg-[#1785c1] text-white flex items-center justify-center">
                    {currentUser.name}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200">
            <div className="px-2 py-1.5 text-sm text-gray-500">
              Signed in as: {user?.email || 'Guest'}
            </div>
            <div className="px-2 py-1.5 text-sm text-gray-500 border-b border-gray-100">
              Role: {userRole}
            </div>
            <DropdownMenuItem>
              <Link to="/profile" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/settings" className="w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
