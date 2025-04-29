
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground py-4">
      <div className="container max-w-5xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          TaskMaster
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm hidden sm:inline-block">
                {user.email}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
