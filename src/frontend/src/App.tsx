import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { AgendaDeHojePage } from './pages/AgendaDeHojePage';
import { ControleDeEstoquePage } from './pages/ControleDeEstoquePage';
import { CatalogoDeServicosPage } from './pages/CatalogoDeServicosPage';
import { FidelidadeClientesPage } from './pages/FidelidadeClientesPage';
import { Toaster } from '@/components/ui/sonner';

export type PageView = 'agenda' | 'estoque' | 'servicos' | 'clientes';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('agenda');

  const renderPage = () => {
    switch (currentPage) {
      case 'agenda':
        return <AgendaDeHojePage />;
      case 'estoque':
        return <ControleDeEstoquePage />;
      case 'servicos':
        return <CatalogoDeServicosPage />;
      case 'clientes':
        return <FidelidadeClientesPage />;
      default:
        return <AgendaDeHojePage />;
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
