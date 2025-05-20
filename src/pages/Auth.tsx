
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Auth = () => {
  const { user, signIn } = useAuth();
  const [loginAs, setLoginAs] = useState<string>('client');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // For the demo, we'll use some test credentials
      if (loginAs === 'client') {
        await signIn('client1@example-domain.com', 'password123');
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <img 
              src="/placeholder.svg" 
              alt="Braintrust Nexus" 
              className="h-12" 
            />
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-6">Login to Braintrust Nexus</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                type="button"
                variant={loginAs === 'client' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setLoginAs('client')}
              >
                Login as Client
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full filter blur-sm opacity-50 pointer-events-none"
                disabled={true}
              >
                Login as SE
              </Button>
            </div>
            
            {loginAs === 'custom' && (
              <>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              <p>Demo - Use these credentials:</p>
              <p>Client: client1@example-domain.com / password123</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
