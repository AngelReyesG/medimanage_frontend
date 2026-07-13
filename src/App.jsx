import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import Pacientes from "./views/Pacientes";
import Citas from "./views/Citas";
import ProtectedRoute from "./components/ProtectedRoute";
import WidgetPaciente from "./views/paciente/WidgetPaciente";
import PanelDoctor from "./views/PanelDoctor"; // <-- Asegúrate de ajustar la ruta real de tu archivo

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
        <Route index element={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          </div>
        } />  
        <Route path="pacientes" element={<Pacientes />} />
        <Route path="citas" element={<Citas />} />
        <Route path="solicitudes" element={<PanelDoctor />} />
      </Route>
      <Route path="/agendar/:medicoId" element={<WidgetPaciente />} />
    </Routes>
  );
}

export default App;