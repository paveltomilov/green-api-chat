import { useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import { Chat } from './pages/Chat';

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Chat />;
}

export default App;