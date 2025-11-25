import { getTasks } from './action';

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
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">{task.title}</h3>
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
        </div>
      )}
    </div>
  );
}
