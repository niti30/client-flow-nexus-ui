
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

// Helper function to clean up auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

// Predefined admin credentials - using a real email format that should pass validation
const ADMIN_EMAIL = "admin1@example-domain.com";
const ADMIN_PASSWORD = "Admin123!";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'client'>('client'); // Default to client
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);

  // Helper to create predefined admin
  const createAdminUser = async () => {
    setCreatingAdmin(true);
    setError(null);
    
    try {
      // Clean up existing auth state to prevent conflicts
      cleanupAuthState();
      
      // Try global signout first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      console.log("Attempting to create admin with:", ADMIN_EMAIL);
      
      // Sign up with admin credentials
      const { data, error } = await supabase.auth.signUp({ 
        email: ADMIN_EMAIL, 
        password: ADMIN_PASSWORD,
        options: {
          data: {
            role: 'admin'
          }
        }
      });
      
      if (error) {
        console.error('Admin creation error:', error);
        
        // If user already exists, try to sign in
        if (error.message.includes('already')) {
          toast({
            title: "Admin exists",
            description: "Admin user already exists. You can sign in with the provided credentials.",
          });
          
          // Auto-fill the credentials
          setEmail(ADMIN_EMAIL);
          setPassword(ADMIN_PASSWORD);
          return;
        }
        
        setError(error.message);
      } else if (data?.user) {
        console.log("Admin user created successfully:", data.user);
        
        // Insert user record with admin role
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            role: 'admin'
          });
        
        if (insertError) {
          console.error('Error creating admin record:', insertError);
          toast({
            title: "Warning",
            description: "Admin created but profile setup failed. Some features may be limited.",
            variant: "destructive",
          });
        } else {
          console.log("Admin record inserted in users table");
          toast({
            title: "Admin created",
            description: `Admin user created with email: ${ADMIN_EMAIL}`,
          });
          
          // Auto-fill the credentials
          setEmail(ADMIN_EMAIL);
          setPassword(ADMIN_PASSWORD);
        }
      }
    } catch (error) {
      console.error('Unexpected admin creation error:', error);
      toast({
        title: "Unexpected error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setLoading(true);
      
      // Clean up existing auth state to prevent conflicts
      cleanupAuthState();
      
      // Try global signout first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      console.log("Attempting sign in with:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        setError(error.message);
        toast({
          title: "Authentication error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Sign in successful, user:", data.user);
        
        // Attempt to get user role from database
        if (data.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.user.id)
            .single();
          
          if (userError) {
            console.error('Error fetching user role:', userError);
          } else if (userData) {
            console.log("User role from database:", userData.role);
          } else {
            console.log("No user data found in database, checking metadata");
            
            // Check user metadata as fallback
            const role = data.user.user_metadata?.role;
            if (role) {
              console.log("User role from metadata:", role);
              
              // Insert into users table for future use
              const { error: insertError } = await supabase
                .from('users')
                .insert({
                  id: data.user.id,
                  email: data.user.email,
                  role: role
                });
                
              if (insertError) {
                console.error("Error creating user record from metadata:", insertError);
              }
            }
          }
        }
        
        toast({
          title: "Success",
          description: "You have successfully signed in!",
        });
        
        // Force page reload for a clean state with the new session
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast({
        title: "Unexpected error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setLoading(true);
      
      // Clean up existing auth state to prevent conflicts
      cleanupAuthState();
      
      console.log("Attempting sign up with:", email, "role:", userRole);
      
      // Sign up with user metadata that includes the role
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            role: userRole
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        setError(error.message);
        toast({
          title: "Registration error",
          description: error.message,
          variant: "destructive",
        });
      } else if (data?.user) {
        console.log("Created user with role:", userRole);
        
        // Insert user record with role
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            role: userRole
          });
        
        if (insertError) {
          console.error('Error creating user record:', insertError);
          toast({
            title: "Warning",
            description: "User created but profile setup failed. Some features may be limited.",
            variant: "destructive",
          });
        } else {
          console.log("User record inserted in users table");
        }
        
        toast({
          title: "Registration successful",
          description: "Please check your email to confirm your registration. If email confirmation is disabled in Supabase, you can sign in immediately.",
        });
        
        // Auto-login the user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error("Error auto-signing in after registration:", signInError);
        } else {
          // Force page reload for a clean state with the new session
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      toast({
        title: "Unexpected error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: "Check your email for a password reset link.",
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast({
        title: "Unexpected error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Nexus Dashboard</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        
        {error && (
          <div className="px-6 mb-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  disabled={creatingAdmin} 
                  onClick={createAdminUser}
                >
                  {creatingAdmin ? "Creating Admin..." : "Create Test Admin"}
                </Button>
                
                <div className="text-sm text-center text-gray-500">
                  Admin: {ADMIN_EMAIL} / {ADMIN_PASSWORD}
                </div>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="name@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Password must be at least 6 characters.
                  </p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="user-role" className="text-sm font-medium">Account Type</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="user-role"
                        value="client"
                        checked={userRole === 'client'}
                        onChange={() => setUserRole('client')}
                        className="rounded-full"
                      />
                      <span>Client</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="user-role"
                        value="admin"
                        checked={userRole === 'admin'}
                        onChange={() => setUserRole('admin')}
                        className="rounded-full"
                      />
                      <span>Admin</span>
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
