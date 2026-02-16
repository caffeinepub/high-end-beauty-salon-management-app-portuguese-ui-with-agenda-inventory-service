import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Lock, ArrowLeft } from 'lucide-react';
import { useAdminPasswordGate } from '../hooks/useAdminPasswordGate';
import { useAdmin } from '../hooks/useAdmin';
import { type PageView } from '../App';

interface AdminLoginPageProps {
  onNavigate: (page: PageView) => void;
}

export function AdminLoginPage({ onNavigate }: AdminLoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);
  const { verifyLogin, isVerifying, clearValidation } = useAdminPasswordGate();
  const { refetch: refetchAdmin } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const isValid = await verifyLogin(username, password);
      
      if (isValid) {
        // Explicitly refetch admin permission after successful login
        setIsCheckingPermission(true);
        const { data: isAdmin } = await refetchAdmin();
        setIsCheckingPermission(false);
        
        if (isAdmin) {
          // Admin permission confirmed, navigate to inventory
          onNavigate('inventory');
        } else {
          // Login succeeded but admin permission not granted
          setError('Admin access was not granted. Please retry or contact support.');
          setPassword('');
          // Clear the validated session so user can retry
          clearValidation();
        }
      } else {
        setError('Invalid username or password. Please try again.');
        setPassword('');
      }
    } catch (err: any) {
      setIsCheckingPermission(false);
      if (err.message === 'Actor not available') {
        setError('Backend is not available. Please try again later.');
      } else {
        setError('Error verifying credentials. Please try again.');
      }
      console.error('Login verification error:', err);
    }
  };

  const handleRetry = () => {
    setError('');
    setUsername('');
    setPassword('');
    clearValidation();
  };

  const isProcessing = isVerifying || isCheckingPermission;

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Button
          variant="ghost"
          onClick={() => onNavigate('profile')}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Button>

        <Card>
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-center">
              <div className="p-4 rounded-full bg-primary/10">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Admin Area Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  disabled={isProcessing}
                  autoFocus
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  disabled={isProcessing}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                  {error.includes('Admin access was not granted') && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleRetry}
                    >
                      Retry Login
                    </Button>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isProcessing}
              >
                {isVerifying ? 'Verifying...' : isCheckingPermission ? 'Checking permissions...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
