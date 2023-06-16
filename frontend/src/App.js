import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import './App.css';
import ChatProvider from './context/ChatProvider';

function App() {
  return (
    <div className="App">
      <ChatProvider>
        <Routes>
          <Route path="/" Component={HomePage} exact />
          <Route path="/chats" Component={ChatPage} />
        </Routes>
      </ChatProvider>
    </div>
  );
}

export default App;
