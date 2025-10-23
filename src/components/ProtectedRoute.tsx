import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="animate-pulse text-primary text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/auth" replace />;
  
  return <>{children}</>;
};
