import { ReactNode } from 'react';
import { AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '../../hooks/useAdmin';
import { useAdminPasswordGate } from '../../hooks/useAdminPasswordGate';
import { type PageView } from '../../App';

interface AdminAccessGateProps {
  children: ReactNode;
  onNavigate?: (page: PageView) => void;
}

export function AdminAccessGate({ children, onNavigate }: AdminAccessGateProps) {
  const { isAdmin, isLoading: isAdminLoading, isFetched } = useAdmin();
  const { isAuthenticated, role, clearValidation } = useAdminPasswordGate();

  // Show loading only during initial fetch
  if (isAdminLoading && !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }

  // Check authentication state first
  if (!isAuthenticated || role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Lock className="h-12 w-12 text-muted-foreground" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please log in to access the admin area.
          </p>
        </div>
        {onNavigate && (
          <Button onClick={() => onNavigate('admin-login')} size="lg">
            Go to Admin Login
          </Button>
        )}
      </div>
    );
  }

  // Then check backend admin permission
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">
            You do not have admin permission to access this page.
          </p>
          <p className="text-sm text-muted-foreground">
            Please re-login with valid admin credentials.
          </p>
        </div>
        {onNavigate && (
          <Button
            onClick={() => {
              clearValidation();
              onNavigate('admin-login');
            }}
            variant="outline"
            size="lg"
          >
            Re-login as Admin
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
