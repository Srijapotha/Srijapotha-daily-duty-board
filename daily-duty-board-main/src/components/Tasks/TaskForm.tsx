
import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task, Priority } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface TaskFormProps {
  onSubmit?: () => void;
  initialData?: Task;
  isEditing?: boolean;
}

export function TaskForm({ onSubmit, initialData, isEditing = false }: TaskFormProps) {
  const { addTask, updateTask } = useTasks();
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && initialData) {
      await updateTask(initialData.id, { 
        title, 
        description, 
        priority 
      });
    } else {
      await addTask({ 
        title, 
        description, 
        completed: false,
        priority
      });
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
    }
    
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className={isEditing ? 'border-0 shadow-none' : 'shadow-md'}>
        <CardContent className={isEditing ? 'px-0 pt-0' : 'p-4'}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as Priority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className={isEditing ? 'px-0 pb-0' : 'px-4 py-3'}>
          <Button 
            type="submit" 
            className="w-full"
          >
            {isEditing ? 'Update Task' : 'Create Task'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
