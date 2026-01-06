import { Task } from "../types/task";
import { TaskStatus, TaskPriority } from "../types/enums";
import { storage } from "./storage";

const TASKS_KEY = "tasks";

export const tasksStorage = {
  getTasks: (): Task[] => {
    const tasks = storage.get<Task[]>(TASKS_KEY) ?? [];
<<<<<<< Updated upstream
    if (tasks.length === 0) {
      return [];
    }
=======
>>>>>>> Stashed changes
    return tasks;
  },

  setTasks: (tasks: Task[]): void => {
    if (!Array.isArray(tasks)) {
      throw new Error("Tasks must be an array");
    }
    storage.set(TASKS_KEY, tasks);
  },

  searchTasks: (query: string): Task[] => {
    const tasks = tasksStorage.getTasks();
<<<<<<< Updated upstream
    const lowerQuery = query.toLowerCase().trim();
    if (lowerQuery.length === 0) {
      return tasks;
    }
    return tasks.filter(
=======
    const lowerQuery = query.toLowerCase();
    const filtered = tasks.filter(
>>>>>>> Stashed changes
      (task) =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.id.toString().includes(lowerQuery)
    );
<<<<<<< Updated upstream
=======
    return filtered;
>>>>>>> Stashed changes
  },

  filterTasks: (predicate: (task: Task) => boolean): Task[] => {
    const tasks = tasksStorage.getTasks();
<<<<<<< Updated upstream
    if (tasks.length === 0) {
      return [];
    }
    return tasks.filter(predicate);
=======
    const filtered = tasks.filter(predicate);
    return filtered;
>>>>>>> Stashed changes
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
