
import { useState, useEffect } from "react";
import { Bell, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // In a real app, you would fetch the current user here
    // For now, we'll use a placeholder
    setCurrentUser({
      name: "Admin User",
      avatar: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
    });
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-end">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center gap-2 p-1 px-2 rounded-full">
              {currentUser && (
                <>
                  <img
                    src={currentUser.avatar}
                    alt="User"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="hidden md:inline">{currentUser.name}</span>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Link to="/profile" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/settings" className="w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button className="w-full text-left">Log out</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
