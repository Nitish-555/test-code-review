import { Task } from "../types/task";
import { storage } from "./storage";

const TASKS_KEY = "tasks";

export const tasksStorage = {
  getTasks: (): Task[] => {
    const tasks = storage.get<Task[]>(TASKS_KEY) ?? [];
    return tasks;
  },

  setTasks: (tasks: Task[]): void => {
    storage.set(TASKS_KEY, tasks);
  },

  searchTasks: (query: string): Task[] => {
    const tasks = tasksStorage.getTasks();
    const lowerQuery = query.toLowerCase();
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.id.toString().includes(lowerQuery)
    );
    return filtered;
  },

  filterTasks: (predicate: (task: Task) => boolean): Task[] => {
    const tasks = tasksStorage.getTasks();
    const filtered = tasks.filter(predicate);
    return filtered;
  },

  updateTask: (taskId: number, updates: Partial<Task>): Task | null => {
    const tasks = tasksStorage.getTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) {
      return null;
    }
    const updated = { ...tasks[index], ...updates };
    tasks[index] = updated;
    tasksStorage.setTasks(tasks);
    return updated;
  },

  deleteTask: (taskId: number): boolean => {
    const tasks = tasksStorage.getTasks();
    const initialLength = tasks.length;
    const filtered = tasks.filter((t) => t.id !== taskId);
    if (filtered.length === initialLength) {
      return false;
    }
    tasksStorage.setTasks(filtered);
    return true;
  },
};
