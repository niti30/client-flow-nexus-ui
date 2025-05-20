
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings, LogOut, User, Menu, Bell } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

const ClientHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
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
  
  const navigateToProfile = () => {
    navigate('/profile');
  };
  
  const navigateToSettings = () => {
    navigate('/settings');
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U";
    
    const name = user.user_metadata?.full_name || 
                user.user_metadata?.name || 
                user.email || 
                "";
                
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="bg-card border-b border-border p-4 flex justify-between items-center relative z-10">
      <div className="flex items-center">
        <h1 className={`text-xl font-semibold truncate ${isMobile ? 'ml-12' : 'ml-0'}`}>Acme Corporation</h1>
      </div>
      <div className="flex items-center space-x-4">
        {/* Notification bell */}
        <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <button 
              className="p-2 rounded-full hover:bg-muted transition-colors relative" 
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-4 bg-card border-border">
            <h3 className="font-medium mb-2">Notifications</h3>
            <div className="space-y-2">
              <div className="text-sm p-2 hover:bg-muted rounded-md">
                <p className="font-medium">Workflow Completed</p>
                <p className="text-muted-foreground text-xs">Invoice #1234 was processed successfully</p>
              </div>
              <div className="text-sm p-2 hover:bg-muted rounded-md">
                <p className="font-medium">New Exception</p>
                <p className="text-muted-foreground text-xs">Exception in Employee Onboarding workflow</p>
              </div>
            </div>
            <DropdownMenuSeparator className="my-2" />
            <button 
              className="text-xs text-primary w-full text-center hover:underline" 
              onClick={() => setNotificationsOpen(false)}
            >
              View all notifications
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User avatar and menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage 
                src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/150?img=12"} 
                alt="User avatar" 
              />
              <AvatarFallback className="bg-muted text-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border-border text-card-foreground">
            <DropdownMenuItem onClick={navigateToProfile} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={navigateToSettings} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 hover:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ClientHeader;
