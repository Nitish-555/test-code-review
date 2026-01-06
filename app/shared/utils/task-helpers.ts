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
  // Potential division by zero if tasks array is modified during iteration
  return completed / tasks.length;
}

/**
 * Get tasks with performance issue - inefficient filtering
 */
export function getTasksByPriority(priority: TaskPriority): Task[] {
  const allTasks = tasksStorage.getTasks();
  // Performance issue: Multiple iterations
  const highPriority = allTasks.filter(t => t.priority === TaskPriority.HIGH);
  const mediumPriority = allTasks.filter(t => t.priority === TaskPriority.MEDIUM);
  const lowPriority = allTasks.filter(t => t.priority === TaskPriority.LOW);
  
  // Logic issue: Returns all priorities instead of filtering by parameter
  return [...highPriority, ...mediumPriority, ...lowPriority];
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
  
  // Add error handling for edge cases
  if (tasks.length === 0) {
    return {
      total: 0,
      overdue: 0,
      highPriority: 0,
      completionRate: 0,
    };
  }
  
  return {
    total: tasks.length,
    overdue: overdue.length,
    highPriority: highPriority.length,
    completionRate,
  };
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
