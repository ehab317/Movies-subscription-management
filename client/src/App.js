import './App.css';
import Login from './auth/Login';
import Home from './pages/Home';
import Register from './auth/Register';
import Header from './components/Header'
import { Route, Routes } from 'react-router';

/**
 * The main app component, which sets up the router and renders
 * the <Header />, and then the correct page based on the URL.
 * 
 * The routes are as follows:
 *  - / : renders the Login page
 *  - /register : renders the Register page
 *  - /home/* : renders the Home page
 * 
 */
function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home/*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
