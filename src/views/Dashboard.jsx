import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [stats, setStats] = useState({
    citasHoy: 0,
    pacientesNuevos: 0,
    loading: true,
    error: ""
  });

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const response = await API.get("/api/dashboard/stats");
        setStats({
          citasHoy: response.data.citasHoy,
          pacientesNuevos: response.data.pacientesNuevos,
          loading: false,
          error: ""
        });
      } catch (err) {
        setStats((prev) => ({ ...prev, loading: false, error: "No se pudieron sincronizar los datos." }));
      }
    };
    cargarEstadisticas();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Fijo */}
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col justify-between p-4 hidden md:flex">
        <div>
          <h1 className="text-xl font-bold text-white mb-8 tracking-tight px-2">MediManage</h1>
          <nav className="space-y-2">
            {/* Cambiado a <Link> profesionales */}
            <Link 
              to="/dashboard" 
              className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${
                location.pathname === "/dashboard" ? "bg-blue-600 text-white" : "hover:bg-slate-800"
              }`}
            >
              Panel Principal
            </Link>
            <Link 
              to="/dashboard/citas" 
              className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${
                location.pathname === "/dashboard/citas" ? "bg-blue-600 text-white" : "hover:bg-slate-800"
              }`}
            >
              Gestionar Citas
            </Link>
            <Link 
              to="/dashboard/pacientes" 
              className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${
                location.pathname === "/dashboard/pacientes" ? "bg-blue-600 text-white" : "hover:bg-slate-800"
              }`}
            >
              Pacientes
            </Link>
          </nav>
        </div>
        <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-red-900/50 hover:text-red-400 transition-colors font-medium">
          Cerrar Sesión
        </button>
      </aside>

      {/* Área de Contenido Variable */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            {location.pathname === "/dashboard/pacientes" ? "Gestión de Pacientes" : "Panel de Control"}
          </h2>
          <button onClick={handleLogout} className="md:hidden bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold">
            Salir
          </button>
        </header>

        {/* 🚨 Si estamos en /dashboard, mostramos el resumen. Si no, <Outlet /> renderiza la vista correspondiente */}
        {location.pathname === "/dashboard" ? (
          <div>
            {stats.error && <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm">{stats.error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
                <h3 className="text-sm font-medium text-slate-500">Citas para Hoy</h3>
                <p className="text-3xl font-bold text-slate-950 mt-2">{stats.loading ? "..." : stats.citasHoy}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
                <h3 className="text-sm font-medium text-slate-500">Pacientes Nuevos</h3>
                <p className="text-3xl font-bold text-slate-950 mt-2">{stats.loading ? "..." : stats.pacientesNuevos}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
                <h3 className="text-sm font-medium text-slate-500">Estado del Servidor</h3>
                <p className={`text-sm font-semibold px-2 py-1 rounded-md inline-block mt-2 ${stats.error ? "text-amber-600 bg-amber-50" : "text-green-600 bg-green-50"}`}>
                  {stats.loading ? "Verificando..." : stats.error ? "Modo Offline" : "Conectado (API)"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Outlet /> 
        )}
      </main>
    </div>
  );
}

export default Dashboard;