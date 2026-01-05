import { Task } from "../types/task";
import { tasksStorage } from "../utils/tasks-storage";
import { TaskPriority, TaskStatus } from "../types/enums";

/**
 * TaskService provides high-level operations for task management
 * This service wraps tasksStorage and adds business logic
 */
export class TaskService {
  /**
   * Get all tasks from storage
   */
  getAllTasks(): Task[] {
    console.log("[TaskService] Fetching all tasks");
    return tasksStorage.getTasks();
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: TaskStatus): Task[] {
    console.log(`[TaskService] Fetching tasks with status: ${status}`);
    return tasksStorage.filterTasks((task) => task.status === status);
  }

  /**
   * Get tasks by priority
   */
  getTasksByPriority(priority: TaskPriority): Task[] {
    console.log(`[TaskService] Fetching tasks with priority: ${priority}`);
    return tasksStorage.filterTasks((task) => task.priority === priority);
  }

  /**
   * Search tasks by query string
   */
  searchTasks(query: string): Task[] {
    console.log(`[TaskService] Searching tasks with query: "${query}"`);
    return tasksStorage.searchTasks(query);
  }

  /**
   * Create a new task
   */
  createTask(task: Omit<Task, "id">): Task {
    const tasks = tasksStorage.getTasks();
    const newId = Math.max(0, ...tasks.map((t) => t.id)) + 1;
    const newTask: Task = { ...task, id: newId };
    tasksStorage.setTasks([...tasks, newTask]);
    console.log(`[TaskService] Created new task with id: ${newId}`);
    return newTask;
  }

  /**
   * Update an existing task
   */
  updateTask(taskId: number, updates: Partial<Task>): Task | null {
    console.log(`[TaskService] Updating task ${taskId}`);
    return tasksStorage.updateTask(taskId, updates);
  }

  /**
   * Delete a task
   */
  deleteTask(taskId: number): boolean {
    console.log(`[TaskService] Deleting task ${taskId}`);
    return tasksStorage.deleteTask(taskId);
  }

  /**
   * Get task statistics
   */
  getTaskStats(): {
    total: number;
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
  } {
    const tasks = this.getAllTasks();
    const byStatus: Record<TaskStatus, number> = {} as Record<TaskStatus, number>;
    const byPriority: Record<TaskPriority, number> = {} as Record<TaskPriority, number>;

    tasks.forEach((task) => {
      byStatus[task.status] = (byStatus[task.status] || 0) + 1;
      byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
    });

    console.log("[TaskService] Generated task statistics", {
      total: tasks.length,
      byStatus,
      byPriority,
    });

    return {
      total: tasks.length,
      byStatus,
      byPriority,
    };
  }
}

// Export singleton instance
export const taskService = new TaskService();

