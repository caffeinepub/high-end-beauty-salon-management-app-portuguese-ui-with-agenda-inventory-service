import { ReactNode } from 'react';
import { AlertTriangle, Lock } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { useAdminPasswordGate } from '../../hooks/useAdminPasswordGate';

interface AdminAccessGateProps {
  children: ReactNode;
}

export function AdminAccessGate({ children }: AdminAccessGateProps) {
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { isValidated } = useAdminPasswordGate();

  if (isAdminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (!isValidated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Lock className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please log in through the Profile page to access this area.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
