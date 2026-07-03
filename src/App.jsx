import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import Pacientes from "./views/Pacientes"; // 🚨 Crearemos este componente en el paso 3
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      
      {/* Ruta Madre del Dashboard Protegida */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      >
        {/* 💡 Index es lo que se muestra por defecto al entrar a /dashboard */}
        <Route index element={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          </div>
        } />
        
        <Route path="pacientes" element={<Pacientes />} />
      </Route>
    </Routes>
  );
}

export default App;