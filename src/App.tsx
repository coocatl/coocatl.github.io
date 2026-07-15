import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProjectStage } from './components/ProjectStage';
import { RouteEffects } from './components/RouteEffects';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectPage } from './pages/ProjectPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<ProjectStage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
