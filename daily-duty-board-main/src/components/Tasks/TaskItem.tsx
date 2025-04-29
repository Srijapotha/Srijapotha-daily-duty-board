
import { useState } from 'react';
import { Task } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { TaskForm } from './TaskForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { updateTask, deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-priority-low/10 text-priority-low border-priority-low/20';
      case 'medium':
        return 'bg-priority-medium/10 text-priority-medium border-priority-medium/20';
      case 'high':
        return 'bg-priority-high/10 text-priority-high border-priority-high/20';
      default:
        return 'bg-priority-medium/10 text-priority-medium border-priority-medium/20';
    }
  };

  const handleToggleComplete = () => {
    updateTask(task.id, { completed: !task.completed });
  };

  const handleDelete = () => {
    setIsDeleting(false);
    deleteTask(task.id);
  };

  return (
    <>
      <Card className={`task-item ${task.completed ? 'opacity-60' : 'opacity-100'} border-l-4 ${task.completed ? 'border-l-green-500' : `border-l-priority-${task.priority}`}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox 
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={handleToggleComplete}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className={`font-medium text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {format(new Date(task.createdAt), 'MMM dd')}
                  </Badge>
                </div>
              </div>
              <p className={`text-sm text-muted-foreground mt-1 ${task.completed ? 'text-gray-400' : ''}`}>
                {task.description}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-4 py-2 bg-muted/30 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsDeleting(true)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm 
            initialData={task}
            onSubmit={() => setIsEditing(false)}
            isEditing
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
