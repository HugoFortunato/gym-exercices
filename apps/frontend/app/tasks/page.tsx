import { getTasks } from './action';
import ListTask from '@/components/list-task';

export default async function TasksPage() {
  const { success, data: tasks, error } = await getTasks();

  if (!success) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <div className="mt-4 rounded-lg border border-red-500 bg-red-500/10 p-4 text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-zinc-400">No tasks found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ListTask tasks={tasks} />
        </div>
      )}
    </div>
  );
}
