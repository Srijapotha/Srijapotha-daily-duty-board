
import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskItem } from './TaskItem';
import { TaskFilter } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TaskList() {
  const { tasks, filter, setFilter, isLoading } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleFilterChange = (value: string) => {
    setFilter(value as TaskFilter);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Tabs 
          value={filter} 
          onValueChange={handleFilterChange}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={() => setIsAddingTask(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse text-muted-foreground">Loading tasks...</div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <h3 className="text-lg font-medium">No tasks found</h3>
            <p className="text-muted-foreground mt-1">
              {filter === 'all'
                ? 'Get started by adding a new task'
                : filter === 'active'
                ? 'No active tasks found'
                : 'No completed tasks found'}
            </p>
            {filter === 'all' && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsAddingTask(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add your first task
              </Button>
            )}
          </div>
        ) : (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
