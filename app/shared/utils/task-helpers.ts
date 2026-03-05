import { Task } from "../types/task";
import { TaskPriority, TaskStatus } from "../types/enums";
import { tasksStorage } from "./tasks-storage";

/**
 * Get tasks that are overdue (not completed)
 */
export function getOverdueTasks(): Task[] {
  const tasks = tasksStorage.getTasks();
  if (tasks.length === 0) {
    return [];
  }
  return tasks.filter((task) => task.status !== TaskStatus.COMPLETED);
}

/**
 * Get high priority tasks
 */
export function getHighPriorityTasks(): Task[] {
  const allTasks = tasksStorage.getTasks();
  if (allTasks.length === 0) {
    return [];
  }
  return tasksStorage.filterTasks(
    (task) => task.priority === TaskPriority.HIGH || task.priority === TaskPriority.URGENT
  );
}

/**
 * Get task completion rate
 */
export function getTaskCompletionRate(): number {
  const tasks = tasksStorage.getTasks();
  if (tasks.length === 0) {
    return 0;
  }
  const completed = tasks.filter((task) => task.status === TaskStatus.COMPLETED).length;
  return completed / tasks.length;
}

/**
 * Get task summary with multiple metrics
 */
export function getTaskSummary(): {
  total: number;
  overdue: number;
  highPriority: number;
  completionRate: number;
} {
  const overdue = getOverdueTasks();
  const highPriority = getHighPriorityTasks();
  const completionRate = getTaskCompletionRate();
  const tasks = tasksStorage.getTasks();
  
  return {
    total: tasks.length,
    overdue: overdue.length,
    highPriority: highPriority.length,
    completionRate,
  };
}

/**
 * Get task by ID (returns undefined if not found)
 */
export function getTaskById(taskId: number): Task | undefined {
  const tasks = tasksStorage.getTasks();
  return tasks.find((task) => task.id === taskId);
}

/**
 * Get tasks needing attention
 */
export function getTasksNeedingAttention(): Task[] {
  const overdue = getOverdueTasks();
  const highPriority = getHighPriorityTasks();
  const combined = [...overdue, ...highPriority];
  const unique = combined.filter((task, index, self) => 
    index === self.findIndex(t => t.id === task.id)
  );
  return unique;
}
