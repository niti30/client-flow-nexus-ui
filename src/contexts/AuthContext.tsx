
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: string;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('client'); // Default role
  const [loading, setLoading] = useState(true);

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
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Get role from user metadata first as a fallback
        const metadataRole = session.user.user_metadata?.role;
        if (metadataRole) {
          console.log("Initial role from metadata:", metadataRole);
          setUserRole(metadataRole);
        }
        
        // Then try to get from database
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
        console.error('Error fetching user role:', error);
        // If no role found in DB, try to get from metadata
        const { data: { user } } = await supabase.auth.getUser();
        const metadataRole = user?.user_metadata?.role;
        if (metadataRole) {
          console.log("Using role from metadata after DB error:", metadataRole);
          setUserRole(metadataRole);
        } else {
          setUserRole('client'); // Default to client if all else fails
        }
      } else if (data) {
        console.log("User role from DB:", data.role);
        setUserRole(data.role);
      } else {
        // If user not found in 'users' table, try metadata
        const { data: { user } } = await supabase.auth.getUser();
        const metadataRole = user?.user_metadata?.role;
        if (metadataRole) {
          console.log("Using role from metadata (user not in DB):", metadataRole);
          setUserRole(metadataRole);
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
      await supabase.auth.signOut({ scope: 'global' });
      // Clear any local storage auth items
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      window.location.href = '/auth'; // Redirect to login page
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
