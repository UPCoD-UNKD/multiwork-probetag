import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './styles/custom.sass'
import { ToastContainer } from 'react-toastify';
import { ViewModeProvider } from './viewmode/ViewModeContext'
import { LanguageProvider } from './i18n/LanguageContext'
import { AuthProvider } from './auth/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import { queryClient } from './config/queryClient'

// Lazy load components for better performance
const Splash = lazy(() => import('./screens/Splash').then(m => ({ default: m.Splash })))
const Login = lazy(() => import('./screens/Login').then(m => ({ default: m.Login })))
const Forgot = lazy(() => import('./screens/Forgot').then(m => ({ default: m.Forgot })))
const Home = lazy(() => import('./screens/Home').then(m => ({ default: m.Home })))
const Signup = lazy(() => import('./screens/Signup').then(m => ({ default: m.Signup })))
const Onboarding = lazy(() => import('./screens/Onboarding').then(m => ({ default: m.Onboarding })))
const Skills = lazy(() => import('./screens/Skills').then(m => ({ default: m.Skills })))
const Users = lazy(() => import('./screens/Users').then(m => ({ default: m.Users })))
const Profile = lazy(() => import('./screens/Profile').then(m => ({ default: m.Profile })))
const Projects = lazy(() => import('./screens/Projects').then(m => ({ default: m.Projects })))
const Joined = lazy(() => import('./screens/Joined').then(m => ({ default: m.Joined })))
const Project = lazy(() => import('./screens/Project').then(m => ({ default: m.Project })))
const CreateProject = lazy(() => import('./screens/CreateProject').then(m => ({ default: m.CreateProject })))
const ProjectOnboarding = lazy(() => import('./screens/ProjectOnboarding').then(m => ({ default: m.ProjectOnboarding })))
const ProjectAdmin = lazy(() => import('./screens/ProjectAdmin').then(m => ({ default: m.ProjectAdmin })))
const Teams = lazy(() => import('./screens/Teams').then(m => ({ default: m.Teams })))
const Team = lazy(() => import('./screens/Team').then(m => ({ default: m.Team })))
const Settings = lazy(() => import('./screens/Settings').then(m => ({ default: m.Settings })))
const Messages = lazy(() => import('./screens/Messages').then(m => ({ default: m.Messages })))
const NotFound = lazy(() => import('./screens/NotFound').then(m => ({ default: m.NotFound })))

// Loading component (simple, doesn't need context)
const LoadingFallback = () => {
  return (
    <div 
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        color: '#ffffff'
      }}
    >
      Loading...
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <ViewModeProvider>
              <BrowserRouter>
                <ToastContainer 
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                />
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Splash />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot" element={<Forgot />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    
                    {/* Protected routes */}
                    <Route path="/home" element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    } />
                    <Route path="/skills" element={
                      <ProtectedRoute>
                        <Skills />
                      </ProtectedRoute>
                    } />
                    <Route path="/users" element={
                      <ProtectedRoute>
                        <Users />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/projects" element={
                      <ProtectedRoute>
                        <Projects />
                      </ProtectedRoute>
                    } />
                    <Route path="/user/projects" element={
                      <ProtectedRoute>
                        <Joined />
                      </ProtectedRoute>
                    } />
                    <Route path="/project/:id" element={
                      <ProtectedRoute>
                        <Project />
                      </ProtectedRoute>
                    } />
                    <Route path="/project/:id/admin" element={
                      <ProtectedRoute>
                        <ProjectAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/project/:projectId/onboarding" element={
                      <ProtectedRoute>
                        <ProjectOnboarding />
                      </ProtectedRoute>
                    } />
                    <Route path="/onboarding/project" element={
                      <ProtectedRoute>
                        <ProjectOnboarding />
                      </ProtectedRoute>
                    } />
                    <Route path="/project/new" element={
                      <ProtectedRoute>
                        <CreateProject />
                      </ProtectedRoute>
                    } />
                    <Route path="/teams" element={
                      <ProtectedRoute>
                        <Teams />
                      </ProtectedRoute>
                    } />
                    <Route path="/team" element={
                      <ProtectedRoute>
                        <Team />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="/messages" element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    } />
                    <Route path='*' element={<NotFound />} />
                  </Routes>
                </Suspense>
                {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
              </BrowserRouter>
            </ViewModeProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
