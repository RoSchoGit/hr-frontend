import AppLayout from "@/layouts/AppLayout";
import TaskList from "@/layouts/TaskList";

function DashboardPage() {
  return (
    <AppLayout>
        <TaskList />
    </AppLayout>
  );
};

export default DashboardPage;
