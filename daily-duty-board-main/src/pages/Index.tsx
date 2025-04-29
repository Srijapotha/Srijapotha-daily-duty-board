
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container max-w-5xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TaskMaster</h1>
          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild variant="secondary" size="sm">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground py-20 px-4">
          <div className="container max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Manage Your Tasks with Ease
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Stay organized, focused, and productive with our simple yet powerful task management application.
            </p>
            <div className="flex justify-center gap-4">
              {user ? (
                <Button asChild size="lg" variant="secondary">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
        
        <section className="py-16 px-4">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Task Management</h3>
                <p className="text-muted-foreground">
                  Create, update, and delete tasks with ease. Keep track of your progress and stay on top of your responsibilities.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Priority Levels</h3>
                <p className="text-muted-foreground">
                  Assign priority levels to your tasks - low, medium, or high - to focus on what's most important.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Task Filtering</h3>
                <p className="text-muted-foreground">
                  Filter tasks by status - all, active, or completed - to focus on what matters most right now.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-muted py-8 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} TaskMaster. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
