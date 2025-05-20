
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: string;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility function to clean up auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
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
};

// Function to check if a user should have access to a path
const isPathAllowed = (path: string, role: string): boolean => {
  // Admin pages
  if (path.startsWith('/admin') || 
      path === '/dashboard' || 
      path === '/billing' || 
      path === '/clients' || 
      path === '/exceptions' || 
      path === '/messaging' || 
      path === '/reporting' || 
      path === '/settings' || 
      path === '/subscriptions' || 
      path === '/users' || 
      path === '/workflows' ||
      path.startsWith('/client-detail')) {
    return role === 'admin' || role === 'se';
  }
  
  // Client pages
  if (path.startsWith('/client/')) {
    return role === 'client';
  }
  
  // Public pages like auth, home, etc.
  if (path === '/' || path === '/auth' || path === '/profile') {
    return true;
  }
  
  return false;
};

// Fixing the component definition to properly use React function component syntax
export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('client'); // Default role
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // When signed in, check user role
        if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
          // Get role from user metadata first as a fallback
          const metadataRole = session.user.user_metadata?.role;
          if (metadataRole) {
            console.log("Role from metadata:", metadataRole);
            setUserRole(metadataRole);
          }
          
          // Then try to get from database (this is more reliable)
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUserRole('client'); // Reset to default on sign out
          console.log("User signed out, reset role to client");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log("Existing session found for user:", session.user.email);
        
        // Get role from user metadata first as a fallback
        const metadataRole = session.user.user_metadata?.role;
        if (metadataRole) {
          console.log("Initial role from metadata:", metadataRole);
          setUserRole(metadataRole);
        }
        
        // Then try to get from database
        fetchUserRole(session.user.id);
      } else {
        console.log("No existing session found");
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Effect to check route permissions
  useEffect(() => {
    if (loading) return;

    // If user is not logged in and trying to access protected page, redirect to auth
    if (!user && location.pathname !== '/auth' && location.pathname !== '/') {
      navigate('/auth');
      return;
    }

    // If user is logged in, check route permissions based on role
    if (user && !isPathAllowed(location.pathname, userRole)) {
      console.log("Access denied to path:", location.pathname, "for role:", userRole);

      // If route is not allowed, redirect to appropriate dashboard based on role
      if (userRole === 'client') {
        navigate('/client/dashboard');
      } else if (userRole === 'admin' || userRole === 'se') {
        navigate('/dashboard');
      }
    }
  }, [location.pathname, userRole, user, loading, navigate]);

  async function fetchUserRole(userId: string) {
    try {
      console.log("Fetching user role for:", userId);
      
      // Check if user is in the 'users' table
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role from DB:', error);
        // If no role found in DB, try to get from metadata
        const { data: { user } } = await supabase.auth.getUser();
        const metadataRole = user?.user_metadata?.role;
        if (metadataRole) {
          console.log("Using role from metadata after DB error:", metadataRole);
          setUserRole(metadataRole);
          
          // Try to insert the user with role in the database
          try {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: userId,
                email: user.email,
                role: metadataRole
              });
              
            if (insertError) {
              console.error("Error inserting user role in DB:", insertError);
              
              // If we get Row Level Security (RLS) policy error, log it but use the role from metadata
              if (insertError.message.includes('row-level security')) {
                console.log("RLS policy prevented user insertion - using metadata role:", metadataRole);
              }
            } else {
              console.log("Inserted user role in DB from metadata:", metadataRole);
            }
          } catch (insertErr) {
            console.error("Unexpected error inserting user role:", insertErr);
          }
        } else {
          console.log("No role in metadata after DB error, defaulting to client");
          setUserRole('client'); // Default to client if all else fails
        }
      } else if (data) {
        console.log("User role from DB:", data.role);
        setUserRole(data.role);
      } else {
        console.log("No user role found in DB");
        // If user not found in 'users' table, try metadata
        const { data: { user } } = await supabase.auth.getUser();
        const metadataRole = user?.user_metadata?.role;
        if (metadataRole) {
          console.log("Using role from metadata (user not in DB):", metadataRole);
          setUserRole(metadataRole);
          
          // Try to insert the user with role in the database
          try {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: userId,
                email: user.email,
                role: metadataRole
              });
              
            if (insertError) {
              console.error("Error inserting user role in DB:", insertError);
              
              // If we get Row Level Security (RLS) policy error, log it but use the role from metadata
              if (insertError.message.includes('row-level security')) {
                console.log("RLS policy prevented user insertion - using metadata role:", metadataRole);
              }
            } else {
              console.log("Inserted user role in DB from metadata:", metadataRole);
            }
          } catch (insertErr) {
            console.error("Unexpected error inserting user role:", insertErr);
          }
        } else {
          console.log("User not found in 'users' table and no metadata role, defaulting to client role");
          setUserRole('client');
        }
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('client'); // Default to client if error
    } finally {
      setLoading(false);
    }
  }

  const signOut = async () => {
    try {
      console.log("Signing out user");
      
      // Clean up auth state before signing out
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.error("Error during supabase signOut:", err);
        // Continue even if this fails
      }
      
      // Reset state
      setUser(null);
      setSession(null);
      setUserRole('client');
      
      // Force page reload for a clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, userRole, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
