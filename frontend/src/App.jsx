
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';

import './App.css';

function RotaProtegida({ children }) {
    const token = localStorage.getItem('token');

    return token ? children : <Navigate to="/" replace />;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />

            <Route
                path="/dashboard"
                element={
                    <RotaProtegida>
                        <Dashboard />
                    </RotaProtegida>
                }
            />
        </Routes>
    );
}

export default App;
