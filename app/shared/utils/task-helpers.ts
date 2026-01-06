import { Task } from "../types/task";
import { TaskPriority, TaskStatus } from "../types/enums";
import { tasksStorage } from "./tasks-storage";

/**
<<<<<<< Updated upstream
 * Get tasks that are overdue (not completed)
 */
export function getOverdueTasks(): Task[] {
  const tasks = tasksStorage.getTasks();
  if (tasks.length === 0) {
    return [];
  }
=======
 * Helper functions for task operations
 * These functions provide additional utilities on top of tasksStorage
 */

/**
 * Get tasks that are overdue (status is not completed)
 */
export function getOverdueTasks(): Task[] {
  const tasks = tasksStorage.getTasks();
  // Simple heuristic: tasks not completed are considered overdue
>>>>>>> Stashed changes
  return tasks.filter((task) => task.status !== TaskStatus.COMPLETED);
}

/**
 * Get high priority tasks
 */
export function getHighPriorityTasks(): Task[] {
<<<<<<< Updated upstream
  const allTasks = tasksStorage.getTasks();
  if (allTasks.length === 0) {
    return [];
  }
=======
>>>>>>> Stashed changes
  return tasksStorage.filterTasks(
    (task) => task.priority === TaskPriority.HIGH || task.priority === TaskPriority.URGENT
  );
}

/**
<<<<<<< Updated upstream
=======
 * Get tasks by multiple criteria
 */
export function getTasksByCriteria(criteria: {
  status?: TaskStatus;
  priority?: TaskPriority;
  searchQuery?: string;
}): Task[] {
  let tasks = tasksStorage.getTasks();

  if (criteria.status) {
    tasks = tasks.filter((task) => task.status === criteria.status);
  }

  if (criteria.priority) {
    tasks = tasks.filter((task) => task.priority === criteria.priority);
  }

  if (criteria.searchQuery) {
    tasks = tasksStorage.searchTasks(criteria.searchQuery);
  }

  return tasks;
}

/**
 * Batch update multiple tasks
 */
export function batchUpdateTasks(
  updates: Array<{ taskId: number; updates: Partial<Task> }>
): Task[] {
  const updatedTasks: Task[] = [];
  updates.forEach(({ taskId, updates: taskUpdates }) => {
    const updated = tasksStorage.updateTask(taskId, taskUpdates);
    if (updated) {
      updatedTasks.push(updated);
    }
  });
  return updatedTasks;
}

/**
>>>>>>> Stashed changes
 * Get task completion rate
 */
export function getTaskCompletionRate(): number {
  const tasks = tasksStorage.getTasks();
<<<<<<< Updated upstream
  if (tasks.length === 0) {
    return 0;
  }
=======
  if (tasks.length === 0) return 0;
>>>>>>> Stashed changes
  const completed = tasks.filter((task) => task.status === TaskStatus.COMPLETED).length;
  return completed / tasks.length;
}

/**
<<<<<<< Updated upstream
 * Get task summary with multiple metrics
=======
 * Get urgent overdue tasks (calls 2 other functions)
 */
export function getUrgentOverdueTasks(): Task[] {
  const overdue = getOverdueTasks();
  const highPriority = getHighPriorityTasks();
  return highPriority.filter(task => 
    overdue.some(t => t.id === task.id)
  );
}

/**
 * Get task summary (calls 3 other functions)
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
 * Get tasks needing attention
=======
 * Get tasks needing attention (calls 2 functions)
>>>>>>> Stashed changes
 */
export function getTasksNeedingAttention(): Task[] {
  const overdue = getOverdueTasks();
  const highPriority = getHighPriorityTasks();
  const combined = [...overdue, ...highPriority];
<<<<<<< Updated upstream
  const unique = combined.filter((task, index, self) => 
    index === self.findIndex(t => t.id === task.id)
  );
  return unique;
}
=======
  return combined.filter((task, index, self) => 
    index === self.findIndex(t => t.id === task.id)
  );
}

/**
 * Get task health metrics (calls 3 functions)
 */
export function getTaskHealthMetrics(): {
  completionRate: number;
  overdueCount: number;
  highPriorityCount: number;
  needsAttentionCount: number;
} {
  const completionRate = getTaskCompletionRate();
  const overdue = getOverdueTasks();
  const needsAttention = getTasksNeedingAttention();
  
  return {
    completionRate,
    overdueCount: overdue.length,
    highPriorityCount: getHighPriorityTasks().length,
    needsAttentionCount: needsAttention.length,
  };
}

/**
 * Validate task before update (calls 1 function)
 */
export function validateTaskUpdate(
  taskId: number,
  updates: Partial<Task>
): { valid: boolean; reason?: string } {
  const needsAttention = getTasksNeedingAttention();
  const task = needsAttention.find(t => t.id === taskId);
  
  if (task && updates.status === TaskStatus.COMPLETED) {
    return { valid: true, reason: 'Completing task that needed attention' };
  }
  
  return { valid: true };
}

>>>>>>> Stashed changes
