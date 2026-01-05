import { Task } from "../types/task";
import { storage } from "./storage";

const TASKS_KEY = "tasks";

export const tasksStorage = {
  getTasks: (): Task[] => {
    const tasks = storage.get<Task[]>(TASKS_KEY) ?? [];
    console.log(`[tasksStorage] Retrieved ${tasks.length} tasks from storage`);
    return tasks;
  },

  setTasks: (tasks: Task[]): void => {
    storage.set(TASKS_KEY, tasks);
    console.log(`[tasksStorage] Saved ${tasks.length} tasks to storage`);
  },

  searchTasks: (query: string): Task[] => {
    const tasks = tasksStorage.getTasks();
    const lowerQuery = query.toLowerCase();
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.id.toString().includes(lowerQuery)
    );
    console.log(`[tasksStorage] Search for "${query}" returned ${filtered.length} tasks`);
    return filtered;
  },

  filterTasks: (predicate: (task: Task) => boolean): Task[] => {
    const tasks = tasksStorage.getTasks();
    const filtered = tasks.filter(predicate);
    console.log(`[tasksStorage] Filtered tasks: ${filtered.length} of ${tasks.length}`);
    return filtered;
  },

  updateTask: (taskId: number, updates: Partial<Task>): Task | null => {
    const tasks = tasksStorage.getTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) {
      console.warn(`[tasksStorage] Task ${taskId} not found for update`);
      return null;
    }
    const updated = { ...tasks[index], ...updates };
    tasks[index] = updated;
    tasksStorage.setTasks(tasks);
    console.log(`[tasksStorage] Updated task ${taskId}`);
    return updated;
  },

  deleteTask: (taskId: number): boolean => {
    const tasks = tasksStorage.getTasks();
    const initialLength = tasks.length;
    const filtered = tasks.filter((t) => t.id !== taskId);
    if (filtered.length === initialLength) {
      console.warn(`[tasksStorage] Task ${taskId} not found for deletion`);
      return false;
    }
    tasksStorage.setTasks(filtered);
    console.log(`[tasksStorage] Deleted task ${taskId}`);
    return true;
  },
};
