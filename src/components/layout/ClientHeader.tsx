
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings, LogOut, User, Menu } from "lucide-react";

const ClientHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  return (
    <header className="bg-card border-b border-border p-4 flex justify-between items-center relative z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold ml-12 md:ml-0 truncate">Acme Corporation</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-1 rounded-full hover:bg-muted">
          <span className="sr-only">Notifications</span>
          <svg className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
              <img 
                src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/150?img=12"} 
                alt="User avatar" 
                className="h-full w-full object-cover"
              />
            </div>
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
