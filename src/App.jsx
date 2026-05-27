import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import CustomCursor from '@/components/CustomCursor';
import PageTransition from '@/components/PageTransition';
import Commander from './pages/Commander';
import Validation from './pages/Validation';
import Discussion from './pages/Discussion';
import ClientDiscussion from './pages/ClientDiscussion';
import AdminSecret from './pages/AdminSecret';
import Jumistx from './pages/Jumistx';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/Commander" element={<LayoutWrapper currentPageName="Commander"><Commander /></LayoutWrapper>} />
      <Route path="/Validation" element={<LayoutWrapper currentPageName="Validation"><Validation /></LayoutWrapper>} />
      <Route path="/Discussion" element={<Discussion />} />
      <Route path="/ClientDiscussion" element={<LayoutWrapper currentPageName="ClientDiscussion"><ClientDiscussion /></LayoutWrapper>} />
      <Route path="/AdminSecret" element={<AdminSecret />} />
      <Route path="/Jumistx" element={<LayoutWrapper currentPageName="Jumistx"><Jumistx /></LayoutWrapper>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider style={{ cursor: 'none' }}>
      <QueryClientProvider client={queryClientInstance}>
        <CustomCursor />
        <Router>
          <PageTransition />
          <AuthenticatedApp />
        </Router>

        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App