import { Task } from "../types/task";
import { TaskStatus } from "../types/enums";
import { 
  getOverdueTasks, 
  getHighPriorityTasks, 
  getTaskCompletionRate,
  getTasksByCriteria,
  getTaskSummary,
  getTasksNeedingAttention,
  getTaskHealthMetrics
} from "./task-helpers";
import { tasksStorage } from "./tasks-storage";

/**
 * Get comprehensive task analytics (calls 4 functions)
 */
export function getTaskAnalytics(): {
  total: number;
  overdue: number;
  highPriority: number;
  completionRate: number;
  needsAttention: number;
} {
  const summary = getTaskSummary();
  const needsAttention = getTasksNeedingAttention();
  
  return {
    total: summary.total,
    overdue: summary.overdue,
    highPriority: summary.highPriority,
    completionRate: summary.completionRate,
    needsAttention: needsAttention.length,
  };
}

/**
 * Get tasks by status with analytics (calls 4 functions)
 */
export function getTasksByStatusWithStats(status: TaskStatus): {
  tasks: Task[];
  stats: {
    overdue: number;
    highPriority: number;
    completionRate: number;
  };
} {
  const criteriaTasks = getTasksByCriteria({ status });
  const overdue = getOverdueTasks();
  const highPriority = getHighPriorityTasks();
  const completionRate = getTaskCompletionRate();
  
  return {
    tasks: criteriaTasks,
    stats: {
      overdue: overdue.filter(t => t.status === status).length,
      highPriority: highPriority.filter(t => t.status === status).length,
      completionRate,
    },
  };
}

/**
 * Check if task system is healthy (calls 2 functions)
 */
export function isTaskSystemHealthy(): boolean {
  const completionRate = getTaskCompletionRate();
  const overdue = getOverdueTasks();
  const total = tasksStorage.getTasks().length;
  
  return completionRate > 0.5 && overdue.length < total * 0.2;
}

/**
 * Get dashboard data (calls 3 functions)
 */
export function getTaskDashboardData(): {
  analytics: ReturnType<typeof getTaskAnalytics>;
  health: boolean;
  healthMetrics: ReturnType<typeof getTaskHealthMetrics>;
} {
  const analytics = getTaskAnalytics();
  const health = isTaskSystemHealthy();
  const healthMetrics = getTaskHealthMetrics();
  
  return { analytics, health, healthMetrics };
}

/**
 * Get task report (calls 4 functions)
 */
export function getTaskReport(): {
  summary: ReturnType<typeof getTaskSummary>;
  analytics: ReturnType<typeof getTaskAnalytics>;
  health: boolean;
  byStatus: Record<TaskStatus, number>;
} {
  const summary = getTaskSummary();
  const analytics = getTaskAnalytics();
  const health = isTaskSystemHealthy();
  const tasks = tasksStorage.getTasks();
  
  const byStatus = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<TaskStatus, number>);
  
  return { summary, analytics, health, byStatus };
}

