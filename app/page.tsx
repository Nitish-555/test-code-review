// KAN-1: Task 1 - smoke test for Jira POC integration
import { TaskManager } from "@/app/components/TaskManager";
import mockTasks from "./shared/utils/mock-data";

export default function Home() {
  return <TaskManager initialTasks={mockTasks} />;
}
