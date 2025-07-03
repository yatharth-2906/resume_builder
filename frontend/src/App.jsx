import './App.css';
import Cookies from 'js-cookie';
import HomePage from './pages/HomePage';
import FilePage from './pages/FilePage';
import LoginPage from './pages/LoginPage';
import HomeLoading from './pages/HomeLoading';
import SignupPage from './pages/SignupPage';
import EditorPage from './pages/EditorPage';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkLoginStatus() {
      setLoading(true);
      try {
        const token = Cookies.get('token');

        if (!token) {
          localStorage.removeItem("user");
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/verifylogin`, {
          method: 'POST',
          headers: {
            "token": "Bearer " + token,
          }
        });

        if (!response.ok) {
          Cookies.remove('token');
          localStorage.removeItem("user");
          return;
        }

        const data = await response.json();
        if (data.status == 'error') {
          Cookies.remove('token');
          localStorage.removeItem("user");
          return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.log(error);
        Cookies.remove('token');
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    }

    checkLoginStatus();
  }, []);

  return (
    <Router>
      {loading ? (<HomeLoading />) :
        (
          <Routes>
            <Route path="*" element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/editor/:fileName" element={<EditorPage />} />
            <Route path="file/:folder/:fileName" element={<FilePage />} />
          </Routes>
        )}
    </Router>
  );
}

export default App;