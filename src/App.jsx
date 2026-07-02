import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard"; // 👈 Asegúrate de que este componente exista

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* 🚨 Esta es la ruta que está buscando el navigate: */}
        <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
  );
}

export default App;