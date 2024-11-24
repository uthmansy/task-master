const API_URL = "https://server-g4w265rdq-uthmansys-projects.vercel.app/api";

export async function login(
  email: string,
  password: string
): Promise<string | null> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    return data.token;
  } else {
    alert("Login failed");
    return null;
  }
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<boolean> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  if (response.ok) {
    return true;
  } else {
    alert("Registration failed");
    return false;
  }
}

export async function getTasks(token: string): Promise<
  {
    title: string;
    description: string;
    completed: boolean;
    _id: string;
    priority: string;
    date: string;
  }[]
> {
  const response = await fetch(`${API_URL}/tasks/get`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    return response.json();
  } else {
    alert("Failed to fetch tasks");
    return [];
  }
}

export async function createTask(
  token: string,
  task: { title: string; description: string; priority: string; date: string }
): Promise<void> {
  await fetch(`${API_URL}/tasks/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
}
export async function searchTask(
  token: string,
  query: string
): Promise<
  {
    title: string;
    description: string;
    completed: boolean;
    _id: string;
    priority: string;
    date: string;
  }[]
> {
  console.log(query);
  console.log(token);
  const response = await fetch(`${API_URL}/tasks/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (response.ok) {
    return response.json();
  } else {
    alert("Failed to search tasks");
    return [];
  }
}

export async function completeTask(
  token: string,
  taskId: string
): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/complete`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ taskId }),
  });

  if (!response.ok) {
    alert("Failed to mark task as completed");
  }
}
export async function deleteTask(token: string, taskId: string): Promise<void> {
  console.log(taskId);
  const response = await fetch(`${API_URL}/tasks/delete`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ taskId }),
  });

  if (!response.ok) {
    alert("Failed to delete task");
  }
}
