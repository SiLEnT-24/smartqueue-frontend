import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth, homeFor } from './context/AuthContext';
import { Spinner } from './components/ui';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Auth').then(({ Login }) => ({ default: Login })));
const Register = lazy(() => import('./pages/Auth').then(({ Register }) => ({ default: Register })));
const StudentDashboard = lazy(() => import('./pages/UserDashboard'));
const GenerateToken = lazy(() => import('./pages/GenerateToken'));
const TokenDetails = lazy(() => import('./pages/TokenDetails'));
const Display = lazy(() => import('./pages/Display'));
const QueueControl = lazy(() => import('./pages/QueueControl'));
const CounterManagement = lazy(() => import('./pages/CounterManagement'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Feedback = lazy(() => import('./pages/Feedback'));
const Profile = lazy(() => import('./pages/Profile'));
const Assistant = lazy(() => import('./pages/Assistant'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Guard = ({ roles, children }) => <ProtectedRoute roles={roles}>{children}</ProtectedRoute>;
function Home() { const { user } = useAuth(); return <Navigate to={homeFor(user.role)} replace />; }

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<Login adminOnly />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-register" element={<Register adminOnly />} />
        <Route path="/display" element={<Display />} />
        <Route path="/app" element={<Guard><Layout /></Guard>}>
          <Route index element={<Guard roles={['user']}><StudentDashboard /></Guard>} />
          <Route path="new" element={<Guard roles={['user']}><GenerateToken /></Guard>} />
          <Route path="token/:id" element={<Guard roles={['user']}><TokenDetails /></Guard>} />
          <Route path="queue" element={<Guard roles={['admin']}><QueueControl /></Guard>} />
          <Route path="admin" element={<Guard roles={['admin']}><AdminDashboard /></Guard>} />
          <Route path="counters" element={<Guard roles={['admin']}><CounterManagement /></Guard>} />
          <Route path="analytics" element={<Guard roles={['admin']}><Analytics /></Guard>} />
          <Route path="feedback" element={<Guard roles={['user', 'admin']}><Feedback /></Guard>} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="profile" element={<Profile />} />
          <Route path="home" element={<Home />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
