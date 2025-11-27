'use client';

import { deleteTask } from '@/app/tasks/action';
import { TrashIcon } from 'lucide-react';

type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ListTask({ tasks }: { tasks: Task[] }) {
  const handleDeleteTask = async (id: string) => {
    const { success, error } = await deleteTask(id);

    if (!success) {
      console.error(error);
    }
  };

  return (
    <>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6"
        >
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <TrashIcon
              className="h-4 w-4 cursor-pointer"
              onClick={() => handleDeleteTask(task.id)}
            />

            {task.completed && (
              <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-500">
                Completed
              </span>
            )}
          </div>

          {task.description && (
            <p className="mt-2 text-sm text-zinc-400">{task.description}</p>
          )}

          <div className="mt-4 text-xs text-zinc-500">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </>
  );
}
