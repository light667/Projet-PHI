import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider.js';
import LandingPage from './pages/LandingPage.js';
import AuthPage from './pages/AuthPage.js';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="phi-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
