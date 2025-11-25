'use server';

type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

type TasksResponse = {
  data: {
    tasks: Task[];
  };
  errors?: Array<{ message: string }>;
};

export async function getTasks() {
  try {
    const response = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            tasks {
              id
              title
              description
            }
          }
        `,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: TasksResponse = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return {
      success: true,
      data: result.data.tasks,
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tasks',
      data: [],
    };
  }
}

export async function getTask(id: string) {
  try {
    const response = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetTask($id: Int!) {
            task(id: $id) {
              id
              title
              description
              completed
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          id: parseInt(id),
        },
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return {
      success: true,
      data: result.data.task,
    };
  } catch (error) {
    console.error('Error fetching task:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch task',
      data: null,
    };
  }
}
