import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { AgendaDeHojePage } from './pages/AgendaDeHojePage';
import { ControleDeEstoquePage } from './pages/ControleDeEstoquePage';
import { CatalogoDeServicosPage } from './pages/CatalogoDeServicosPage';
import { FidelidadeClientesPage } from './pages/FidelidadeClientesPage';
import { ExpensesDashboardPage } from './pages/ExpensesDashboardPage';
import { AdminLandingPage } from './pages/AdminLandingPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { Toaster } from '@/components/ui/sonner';

export type PageView = 'home' | 'services' | 'appointments' | 'profile' | 'inventory' | 'expenses' | 'admin' | 'admin-login';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'services':
        return <CatalogoDeServicosPage />;
      case 'appointments':
        return <AgendaDeHojePage />;
      case 'profile':
        return <FidelidadeClientesPage onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminLandingPage onNavigate={setCurrentPage} />;
      case 'admin-login':
        return <AdminLoginPage onNavigate={setCurrentPage} />;
      case 'inventory':
        return <ControleDeEstoquePage onNavigate={setCurrentPage} />;
      case 'expenses':
        return <ExpensesDashboardPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </AppLayout>
      <Toaster />
    </>
  );
}

export default App;
