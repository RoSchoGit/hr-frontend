import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SettingsPage from "@/pages/SettingsPage";
import ProfilePage from "@/pages/ProfilePage";
import LogoutPage from './pages/LogoutPage';
import AppLayout from './layouts/AppLayout';
import ProcessListPage from './pages/process/ProcessListPage';
import TaskListPage from './pages/task/TaskListPage';
import TaskPage from './pages/task/TaskPage';
import CreateProcessLayout from './pages/process/create/CreateProcessLayout';
import CreateStep1 from './pages/process/create/CreateStep1Page';
import CreateStep2 from './pages/process/create/CreateStep2Page';
import CreateStep3 from './pages/process/create/CreateStep3Page';
import ProcessEditPage from './pages/process/ProcessEditPage';
import ProcessPage from './pages/process/ProcessPage';
import { Navigate } from 'react-router-dom';
import { KeycloakProvider } from './keycloak/KeycloakProvider';
import ProcessLayout from './pages/process/ProcessLayout';

function App() {
  return (
    <KeycloakProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/processes" replace />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/logout" element={<LogoutPage />} />

          <Route path="/processes" element={<AppLayout />}>
            <Route index element={<ProcessListPage />} />

            {/* Layout für alle Prozess-bezogenen Seiten */}
            <Route path=":processId" element={<ProcessLayout />}>
              <Route index element={<ProcessPage />} />
              <Route path="edit" element={<ProcessEditPage />} />
              <Route path="tasks" element={<TaskListPage />} />
              <Route path="task/:taskId" element={<TaskPage />} />
            </Route>

            <Route path="create" element={<CreateProcessLayout />}>
              <Route path="step-1" element={<CreateStep1 />} />
              <Route path="step-2" element={<CreateStep2 />} />
              <Route path="step-3" element={<CreateStep3 />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/processes" replace />} />
        </Routes>
      </Router>
    </KeycloakProvider>
  );
}

export default App;
