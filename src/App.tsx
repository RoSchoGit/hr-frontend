import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SettingsPage from "@/pages/SettingsPage";
import ProfilePage from "@/pages/ProfilePage";
import AppLayout from './layouts/AppLayout';
import ProcessListPage from './process/ProcessListPage';
import TaskListPage from './task/TaskListPage';
import TaskDetailsPage from './task/TaskDetailsPage';
import CreateProcessLayout from './process/create/CreateProcessLayout';
import CreateStep1 from './process/create/CreateStep1';
import CreateStep2 from './process/create/CreateStep2';
import CreateStep3 from './process/create/CreateStep3';
import ProcessEditPage from './process/ProcessEditPage';
import ProcessInfoPage from './process/ProcessInfoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="processes" element={<AppLayout />}>
          <Route index element={<ProcessListPage />} />
          <Route path=":processId" element={<ProcessInfoPage />} />
          <Route path=":processId/edit" element={<ProcessEditPage />} />
          <Route path=":processId/tasks" element={<TaskListPage />} />
          <Route path=":processId/task/:taskId" element={<TaskDetailsPage />} />

          <Route path="create" element={<CreateProcessLayout />}>
            <Route path="step-1" element={<CreateStep1 />} />
            <Route path="step-2" element={<CreateStep2 />} />
            <Route path="step-3" element={<CreateStep3 />} />
          </Route>
        </Route>

      </Routes>
    </Router>


  );
}

export default App;
